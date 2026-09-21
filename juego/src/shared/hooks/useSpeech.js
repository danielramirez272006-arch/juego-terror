import { useCallback } from 'react';

export const useSpeech = () => {
  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    
    // Evita solapar voces
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar una voz lenta y perturbadora
    utterance.rate = 0.5; // Muy lento
    utterance.pitch = 0.1; // Muy grave (casi demoníaco)
    utterance.volume = 1;
    
    // Intentar buscar una voz en español si existe
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.includes('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
};
