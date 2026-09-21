import { useEffect, useState } from 'react';

export const useSecretCode = (secretCode, onTrigger) => {
  const [, setInputBuffer] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorar teclas si se está escribiendo en un input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toUpperCase();
      // Solo tomamos letras
      if (/^[A-Z]$/.test(key)) {
        setInputBuffer((prev) => {
          const newBuffer = (prev + key).slice(-secretCode.length);
          if (newBuffer === secretCode.toUpperCase()) {
            onTrigger();
            return ''; // Limpiar buffer tras activarse
          }
          return newBuffer;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [secretCode, onTrigger]);

  return null;
};
