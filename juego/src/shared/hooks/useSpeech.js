import { useCallback } from 'react';

export const useSpeech = () => {
  const speak = useCallback((text) => {
    try {
      if (!('speechSynthesis' in window)) return;
      
      // Evita solapar voces
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.5; // Muy lento
      utterance.pitch = 0.1; // Grave
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      if (Array.isArray(voices) && voices.length > 0) {
        const spanishVoice = voices.find(v => v && v.lang && v.lang.toLowerCase().includes('es'));
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }
      }
      
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignorar errores de SpeechSynthesis en navegadores no soportados
    }
  }, []);

  return { speak };
};
