import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../inventory/useInventory';
import { useAudioEngine } from '../audio/useAudioEngine';

const LOCAL_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/scores';

export const useGame = (nivelInicial = 1) => {
  const finalizadoRef = useRef(false);
  
  // --- ESTADOS NÚCLEO (Edición Definitiva) ---
  const [bucleActual, setBucleActual] = useState(nivelInicial);
  const [sanity, setSanity] = useState(100); // Cordura 0-100%
  const [room, setRoom] = useState('hallway'); // 'hallway', 'bathroom', 'basement'
  
  const [estadoSusto, setEstadoSusto] = useState(false);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  
  // API states
  const [loading, setLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState(null);
  const [puntajes, setPuntajes] = useState([]);
  
  // UI states
  const [mensajeAlerta, setMensajeAlerta] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [victoria, setVictoria] = useState(false);
  const [notaActiva, setNotaActiva] = useState(null);
  const [codigoSecreto] = useState(() => [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10)
  ]);
  const [luzEncendida, setLuzEncendida] = useState(true);

  // --- HOOKS ADICIONALES ---
  const { items, addItem } = useInventory();
  const { playSound, stopAll, setVolume } = useAudioEngine();
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // --- EFECTOS ---
  // Iniciar timer global de la partida
  useEffect(() => {
    if (!juegoTerminado) {
      timerRef.current = setInterval(() => {
        setTiempoTranscurrido((prev) => prev + 1);
        // Bajar cordura poco a poco pasivamente
        setSanity((prev) => Math.max(prev - 0.5, 0));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopAll();
    };
  }, [juegoTerminado, stopAll]);

  // Audio ambiente dinámico
  useEffect(() => {
    if (!juegoTerminado) {
      playSound('ambiente');
      const newVol = Math.max(0.3, Math.min(1.0, 1.0 - (sanity / 100)));
      setVolume('ambiente', newVol);
    }
  }, [sanity, juegoTerminado, playSound, setVolume]);

  // --- API (GET/POST) ---
  const obtenerPuntajes = async () => {
    setLoading(true);
    setErrorGlobal(null);
    try {
      const response = await fetch(LOCAL_API_URL);
      if (!response.ok) throw new Error('Error al conectar con json-server');
      const data = await response.json();
      setPuntajes(data);
    } catch {
      setErrorGlobal('Servidor no disponible. Ejecuta: npx json-server --watch db.json --port 3000');
    } finally {
      setLoading(false);
    }
  };

  const finalizarPartida = useCallback(async (nombreJugador, isVictory = false) => {
    if (finalizadoRef.current) return;
    finalizadoRef.current = true;
    setJuegoTerminado(true);
    stopAll();
    if (isVictory) {
      playSound('victory');
    } else {
      playSound('gameover');
    }
    
    setLoading(true);
    
    // Simulate API delay for dramatic effect
    await new Promise(r => setTimeout(r, 1000));
    
    const playerData = {
      id: crypto.randomUUID(),
      nombre: nombreJugador || "Desconocido",
      nivel: bucleActual,
      tiempo: tiempoTranscurrido
    };
    
    try {
      // 1. Guardar en JSON-Server (Puntajes)
      const res = await fetch(import.meta.env.VITE_API_URL || 'http://localhost:3000/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData)
      });
      
      // 2. Enviar a N8N
      if (import.meta.env.VITE_WEBHOOK_N8N_URL) {
        await fetch(import.meta.env.VITE_WEBHOOK_N8N_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(playerData)
        }).catch(err => console.error("Error webhook:", err));
      }

      if (!res.ok) throw new Error("No se pudo guardar la inscripción");

      if (isVictory) {
        setVictoria(true);
      } else {
        navigate('/puntajes');
      }
    } catch (error) {
      setErrorGlobal(error.message);
      // Fallback redirection in case of error
      if (!isVictory) navigate('/puntajes');
    } finally {
      setLoading(false);
    }
  }, [bucleActual, tiempoTranscurrido, navigate, playSound, stopAll]);

  // Condición de Derrota
  useEffect(() => {
    if (sanity <= 0 && !juegoTerminado) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      finalizarPartida("Alma Perdida", false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanity, juegoTerminado]);
  // --- MECÁNICAS DE JUEGO ---
  const recibirSusto = useCallback((danio = 20) => {
    if (finalizadoRef.current) return;
    setEstadoSusto(true);
    playSound('susto');
    setSanity((prev) => Math.max(prev - danio, 0));
    
    setTimeout(() => {
      setEstadoSusto(false);
    }, 1500);
  }, [playSound]);

  const bajarCordura = useCallback((danio = 2) => {
    setSanity((prev) => Math.max(prev - danio, 0));
  }, []);

  const cambiarHabitacion = useCallback((nuevaHabitacion) => {
    playSound('puerta');
    setRoom(nuevaHabitacion);
  }, [playSound]);

  const recogerObjeto = useCallback((item) => {
    addItem(item);
  }, [addItem]);

  const cruzarPuerta = useCallback(() => {
    playSound('puerta');
    setTransitioning(true);
    
    setTimeout(() => {
      // Condición de Final Bueno
      if (bucleActual >= 5) {
        finalizarPartida("Superviviente", true);
        return;
      }
      
      const nextBucle = bucleActual + 1;
      setBucleActual(prev => {
        const next = prev + 1;
        if (next > 2 && next < 5) setLuzEncendida(false); // Luz se rompe
        return next;
      });
      setRoom('hallway'); // Reset room

      // Inyectar objeto maldito en el inventario al llegar al bucle 4
      if (nextBucle === 4 && !items.includes("TUS PECADOS")) {
        addItem("TUS PECADOS");
      }
      
      setTimeout(() => setTransitioning(false), 50);
    }, 300);
  }, [bucleActual, items, addItem, finalizarPartida, playSound]);

  const mostrarAlerta = useCallback((mensaje) => {
    setMensajeAlerta(mensaje);
    setTimeout(() => {
      setMensajeAlerta(null);
    }, 3500);
  }, []);

  const leerNota = useCallback((texto) => {
    setNotaActiva(texto);
    setSanity(prev => Math.max(prev - 10, 0));
    playSound('ui_error');
  }, [playSound]);

  const cerrarNota = useCallback(() => {
    setNotaActiva(null);
  }, []);

  const repararLuz = useCallback(() => {
    setLuzEncendida(true);
    playSound('ui_click');
    mostrarAlerta("Luz restaurada.");
  }, [playSound, mostrarAlerta]);

  return {
    estado: { bucleActual, sanity, room, estadoSusto, tiempoTranscurrido, loading, errorGlobal, puntajes, inventory: items, mensajeAlerta, transitioning, victoria, codigoSecreto, notaActiva, luzEncendida },
    acciones: { recibirSusto, bajarCordura, cruzarPuerta, finalizarPartida, obtenerPuntajes, cambiarHabitacion, recogerObjeto, mostrarAlerta, leerNota, cerrarNota, repararLuz }
  };
};
