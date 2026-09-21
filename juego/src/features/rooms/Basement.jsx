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

      {/* Avanzar por la oscuridad */}
      <div 
        className="interactive-zone move"
        onClick={() => recibirSusto(30)}
        title="Avanzar por la oscuridad (-30 Cordura)"
        style={{ top: '40%', left: '40%', width: '20%', height: '40%' }}
      />

      {/* Nota oculta en el suelo */}
      <div 
        className="interactive-zone look"
        onClick={() => acciones.leerNota("Día 43...\nEl monstruo reacciona al sonido.\nNo respires, no hables.\nLa puerta final requiere sangre y el código está oculto en el vapor...\nÉl no me dejará salir.")}
        title="Leer papel arrugado en el suelo"
        style={{ top: '80%', left: '70%', width: '10%', height: '10%' }}
      />

      {/* Caja de Fusibles */}
      {!estado.luzEncendida && (
        <div 
          className="interactive-zone grab"
          onClick={() => acciones.repararLuz()}
          title="Reparar Caja de Fusibles"
          style={{ top: '30%', left: '75%', width: '15%', height: '25%', border: '2px dashed yellow' }}
        />
      )}

      {/* Huir rápido al pasillo (Escaleras o Puerta trasera) */}
      <div 
        className="interactive-zone move"
        onClick={() => cambiarHabitacion('hallway')}
        title="Huir rápido al pasillo superior"
        style={{ top: '10%', left: '10%', width: '20%', height: '80%' }}
      />
    </div>
  );
};
