import { useRef, useCallback } from 'react';

/**
 * Motor de audio para gestionar múltiples capas de sonido.
 * En un entorno de producción, estos URLs apuntarían a assets locales o CDN.
 */
const AUDIO_SOURCES = {
  ambiente: 'https://cdn.freesound.org/previews/205/205569_3327666-lq.mp3', // Zumbido/viento oscuro
  susto: 'https://cdn.freesound.org/previews/173/173954_3183570-lq.mp3', // Ruido estridente
  susurro: 'https://cdn.freesound.org/previews/562/562758_12674488-lq.mp3', // Susurro incomprensible
  puerta: 'https://cdn.freesound.org/previews/431/431117_8639206-lq.mp3', // Puerta rechinando
  bloqueada: 'https://cdn.freesound.org/previews/167/167074_2193266-lq.mp3', // Picaporte bloqueado
  victory: 'https://cdn.freesound.org/previews/320/320655_527080-lq.mp3', // Campanada de victoria
  gameover: 'https://cdn.freesound.org/previews/333/333832_4700010-lq.mp3', // Muerte / Jumpscare largo
  ui_error: 'https://cdn.freesound.org/previews/142/142608_1843198-lq.mp3', // Sonido UI de error
  ui_click: 'https://cdn.freesound.org/previews/256/256116_3263906-lq.mp3' // Sonido UI clic
};

export const useAudioEngine = () => {
  const audioRefs = useRef({});

  // Inicializar un audio si no existe en la referencia
  const getAudio = (key) => {
    if (!audioRefs.current[key]) {
      const audio = new Audio(AUDIO_SOURCES[key]);
      if (key === 'ambiente') {
        audio.loop = true;
        audio.volume = 0.5;
      } else {
        audio.volume = 0.8;
      }
      audioRefs.current[key] = audio;
    }
    return audioRefs.current[key];
  };

  const playSound = useCallback((key) => {
    try {
      const audio = getAudio(key);
      // Reiniciar si ya está sonando
      audio.currentTime = 0;
      audio.play().catch(e => console.warn('Bloqueado por autoplay policy', e));
    } catch (error) {
      console.error("Error reproduciendo audio", error);
    }
  }, []);

  const stopSound = useCallback((key) => {
    if (audioRefs.current[key]) {
      audioRefs.current[key].pause();
      audioRefs.current[key].currentTime = 0;
    }
  }, []);

  const stopAll = useCallback(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  const setVolume = useCallback((key, volume) => {
    if (audioRefs.current[key]) {
      audioRefs.current[key].volume = volume;
    }
  }, []);

  return { playSound, stopSound, stopAll, setVolume };
};
