import { useState, useEffect, useRef, useCallback } from 'react';

export const useMicrophone = (onLoudNoise, threshold = 30) => {
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const requestFrameRef = useRef(null);
  const callbackRef = useRef(onLoudNoise);
  const thresholdRef = useRef(threshold);

  useEffect(() => {
    callbackRef.current = onLoudNoise;
    thresholdRef.current = threshold;
  }, [onLoudNoise, threshold]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (requestFrameRef.current) cancelAnimationFrame(requestFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  const startListening = useCallback(async () => {
    try {
      if (streamRef.current) return; // Ya está escuchando
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      setIsListening(true);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calcular el volumen promedio
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const averageVolume = sum / bufferLength;

        if (averageVolume > thresholdRef.current && callbackRef.current) {
          callbackRef.current(averageVolume);
        }

        requestFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn("El jugador no dio permisos de micrófono o no hay uno disponible.", err);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return { isListening, startListening, stopListening };
};

