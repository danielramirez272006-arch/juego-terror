import { useEffect } from 'react';
import { useSpeech } from '../../shared/hooks/useSpeech';
import { useGlobalContext } from '../../shared/context/GlobalContext';

export const Bathroom = ({ acciones, estado, isTyping }) => {
  const { recibirSusto, cambiarHabitacion, recogerObjeto } = acciones;
  const { inventory, codigoSecreto } = estado;
  const { nombreJugador } = useGlobalContext();
  const { speak } = useSpeech();

  // Efecto aleatorio: Cuando entras al baño, hay un 30% de probabilidad de que tu PC te hable
  useEffect(() => {
    const random = Math.random();
    if (random > 0.7 && nombreJugador) {
      setTimeout(() => {
        speak(`Te estoy viendo... ${nombreJugador}`);
      }, 2000); // Tarda 2 segundos en hablarte para mayor tensión
    }
  }, [speak, nombreJugador]);

  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: 'url(/bathroom.jpg)',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      
      {!isTyping && (
        <>
          {/* El Espejo Empañado */}
          <div 
            style={{ position: 'absolute', top: '15%', left: '30%', width: '30%', height: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Texto oculto detrás del vapor */}
            <span style={{ color: 'darkred', fontSize: '3rem', fontFamily: 'Courier New', fontWeight: 'bold', textShadow: '0 0 5px red', zIndex: 1 }}>
              {codigoSecreto.join('-')}
            </span>
            
            {/* Vapor interactivo (desaparece al pasar el mouse por encima repetidamente o simplemente hover) */}
            <div 
              className="interactive-zone look"
              onClick={() => recibirSusto()}
              title="Limpiar el espejo"
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(200, 210, 210, 0.95)',
                backdropFilter: 'blur(8px)',
                transition: 'opacity 2s ease',
                zIndex: 2,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.95'; }}
            />
          </div>
          
          {/* Lavabo / Recoger Llave */}
          {!inventory.includes('Llave Oxidada') && (
            <div 
              className="interactive-zone grab"
              onClick={() => recogerObjeto('Llave Oxidada')}
              title="Inspeccionar el lavabo (Recoger Llave Oxidada)"
              style={{ top: '60%', left: '35%', width: '20%', height: '20%' }}
            />
          )}
          
          {/* Puerta para volver al pasillo */}
          <div 
            className="interactive-zone move"
            onClick={() => cambiarHabitacion('hallway')}
            title="Volver al pasillo"
            style={{ top: '20%', left: '80%', width: '15%', height: '70%' }}
          />
        </>
      )}
    </div>
  );
};
