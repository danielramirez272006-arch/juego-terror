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
      {/* Huir rápido al pasillo (Escaleras a la izquierda) */}
      <div 
        className="interactive-zone move"
        onClick={() => cambiarHabitacion('hallway')}
        style={{ top: '10%', left: '5%', width: '22%', height: '80%' }}
      >
        <span className="zone-tooltip">🚪 Subir Escaleras</span>
      </div>

      {/* Avanzar por la oscuridad */}
      <div 
        className="interactive-zone move"
        onClick={() => recibirSusto(30)}
        style={{ top: '35%', left: '38%', width: '24%', height: '45%' }}
      >
        <span className="zone-tooltip">👣 Adentrarse en la Oscuridad</span>
      </div>

      {/* Nota oculta en el suelo */}
      <div 
        className="interactive-zone look"
        onClick={() => acciones.leerNota("Día 43...\nEl monstruo reacciona al sonido.\nNo respires, no hables.\nLa puerta final requiere sangre y el código está oculto en el vapor...\nÉl no me dejará salir.")}
        style={{ top: '70%', left: '65%', width: '14%', height: '18%' }}
      >
        <span className="zone-tooltip">📜 Diario de la Víctima</span>
      </div>

      {/* Caja de Fusibles */}
      {!estado.luzEncendida && (
        <div 
          className="interactive-zone grab"
          onClick={() => acciones.repararLuz()}
          style={{ top: '25%', left: '75%', width: '18%', height: '30%', border: '2px dashed yellow' }}
        >
          <span className="zone-tooltip">⚡ Reparar Fusibles (Luz)</span>
        </div>
      )}
    </div>
  );
};
