import { CombinationLock } from '../puzzles/CombinationLock';

export const Hallway = ({ acciones, estado, isTyping }) => {
  const { recibirSusto, cambiarHabitacion, cruzarPuerta, mostrarAlerta } = acciones;
  const { bucleActual, inventory } = estado;
  
  // El estado de mousePos ya no se usa aquí porque el fondo estático reemplaza los ojos CSS.

  const getBackground = () => {
    if (!estado.luzEncendida || bucleActual >= 5) return 'none';
    if (bucleActual >= 3) return 'url(/hallway_corrupt.jpg)';
    return 'url(/hallway.jpg)';
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: getBackground(),
      backgroundColor: (!estado.luzEncendida || bucleActual >= 5) ? '#000' : 'transparent',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      
      {!isTyping && (
        <>
          {bucleActual === 5 ? (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.9)', padding: '30px', border: '1px solid red', zIndex: 40 }}>
              <p style={{ color: 'red' }}>La puerta final tiene un candado. Se ve la marca del diablo escrita en sangre.</p>
              <CombinationLock correctAnswer={estado.codigoSecreto} onUnlock={() => cruzarPuerta()} />
            </div>
          ) : (
            <>
              {/* Cuadro Torcido (Scare) */}
              <div 
                className="interactive-zone look"
                onClick={() => recibirSusto()}
                title="Mirar el cuadro torcido"
                style={{ top: '20%', left: '15%', width: '12%', height: '30%' }}
              />
              
              {/* Puerta de la Cocina (Izquierda) */}
              <div 
                className="interactive-zone move"
                onClick={() => cambiarHabitacion('kitchen')}
                title="Entrar a la Cocina"
                style={{ top: '20%', left: '5%', width: '25%', height: '60%' }}
              />

              {/* Escotilla del Ático (Techo) */}
              <div 
                className="interactive-zone move"
                onClick={() => {
                  if (!inventory.includes('Llave del Ático')) {
                    mostrarAlerta('La escotilla está cerrada con llave. Huele a óxido.');
                  } else {
                    cambiarHabitacion('attic');
                  }
                }}
                title="Subir al Ático"
                style={{ top: '0%', left: '35%', width: '30%', height: '15%' }}
              />

              {/* Puerta Principal del Fondo (Centro) */}
              <div 
                className="interactive-zone move"
                onClick={() => {
                  if (bucleActual === 3 && !inventory.includes('Llave Oxidada')) {
                    mostrarAlerta('La puerta está trabada. Necesitas la Llave Oxidada que vi en el baño...');
                  } else {
                    cruzarPuerta();
                  }
                }}
                title="Cruzar la puerta del fondo"
                style={{ top: '35%', left: '40%', width: '15%', height: '40%' }}
              />

              {/* Puerta del Sótano (Derecha Centro) */}
              <div 
                className="interactive-zone move"
                onClick={() => cambiarHabitacion('basement')}
                title="Bajar al Sótano"
                style={{ top: '35%', left: '55%', width: '12%', height: '40%' }}
              />

              {/* Puerta del Baño (Derecha) */}
              <div 
                className="interactive-zone move"
                onClick={() => cambiarHabitacion('bathroom')}
                title="Ir al Baño"
                style={{ top: '20%', left: '70%', width: '20%', height: '70%' }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
