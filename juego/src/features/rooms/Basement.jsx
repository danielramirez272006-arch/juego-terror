import { useEffect } from 'react';
import { useMicrophone } from '../../shared/hooks/useMicrophone';

export const Basement = ({ acciones, estado, isTyping }) => {
  const { recibirSusto, cambiarHabitacion, mostrarAlerta } = acciones;

  // Callback cuando el micro detecta ruido fuerte
  const handleLoudNoise = () => {
    // Te penaliza fuertemente y te asusta
    recibirSusto(100); // Muerte casi instantánea
    mostrarAlerta("¡HICISTE RUIDO! TE ESCUCHÓ...");
  };

  const { startListening, stopListening } = useMicrophone(handleLoudNoise, 25); // Umbral de 25

  useEffect(() => {
    // Iniciar escucha del micrófono al terminar de escribir el texto
    if (!isTyping) {
      startListening();
    }
    return () => stopListening();
  }, [isTyping, startListening, stopListening]);

  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: 'url(/basement.jpg)',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      position: 'relative'
    }}>

      {/* Generador a la izquierda */}
      <div 
        className="interactive-zone grab"
        onClick={handleGeneratorClick}
        title="Reparar el generador"
        style={{ top: '40%', left: '15%', width: '25%', height: '40%' }}
      />

      {/* Nota en el centro */}
      <div 
        className="interactive-zone look"
        onClick={() => leerNota("BITÁCORA:\n\nLa oscuridad lo fortalece. Si las luces se apagan, debes repararlas inmediatamente o te encontrará. \n\nPD: He escondido mi pistola en la caja fuerte de esta habitación. La combinación es... espera, ¿qué fue ese ruido?")}
        title="Leer nota polvorienta"
        style={{ top: '70%', left: '45%', width: '10%', height: '10%' }}
      />

      {/* Caja fuerte a la derecha */}
      <div 
        className="interactive-zone look"
        onClick={() => setSafeOpen(true)}
        title="Abrir Caja Fuerte"
        style={{ top: '50%', left: '65%', width: '20%', height: '30%' }}
      />

      {safeOpen && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.9)', padding: '20px', border: '1px solid gray', zIndex: 40 }}>
          <p style={{ color: 'white', marginBottom: '10px' }}>Introduce la combinación de la caja fuerte:</p>
          <CombinationLock correctAnswer={[estado.codigoSecreto[0], estado.codigoSecreto[1], estado.codigoSecreto[2]]} onUnlock={handleSafeUnlock} />
          <button onClick={() => setSafeOpen(false)} style={{ marginTop: '10px', width: '100%' }}>Cerrar</button>
        </div>
      )}

      {/* Volver al pasillo */}
      <div 
        className="interactive-zone move"
        onClick={() => cambiarHabitacion('hallway')}
        title="Subir escaleras al pasillo"
        style={{ top: '80%', left: '40%', width: '20%', height: '15%' }}
      />
    </div>
  );
};
