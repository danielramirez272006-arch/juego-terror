import { CombinationLock } from '../puzzles/CombinationLock';

export const Hallway = ({ acciones, estado }) => {
  const { recibirSusto, cambiarHabitacion, cruzarPuerta, mostrarAlerta } = acciones;
  const { bucleActual, inventory } = estado;
  
  const tieneLlaveAtico = Boolean(inventory && inventory.some(i => 
    i.toLowerCase().includes('tico') || 
    i.includes('Ático') || 
    i.includes('Atico') ||
    i === 'Llave del Ático'
  ));

  const tieneLlaveOxidada = Boolean(inventory && inventory.some(i => 
    i.toLowerCase().includes('oxidada') || 
    i === 'Llave Oxidada'
  ));

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
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 5 }}>
        
        {/* 1. Puerta de la Cocina (Puerta izquierda con cartel "KITCHEN") */}
        <button 
          type="button"
          className="interactive-zone move"
          onClick={() => {
            cambiarHabitacion('kitchen');
            mostrarAlerta("Entraste a la Cocina...");
          }}
          style={{ top: '12%', left: '6%', width: '17%', height: '78%', zIndex: 50, cursor: 'pointer', background: 'transparent', border: 'none', outline: 'none' }}
        >
          <span className="zone-tooltip">🚪 Cocina</span>
        </button>

        {/* 2. Escotilla del Ático (Techo superior central con escalera de madera) */}
        <button 
          type="button"
          className="interactive-zone move"
          onClick={() => {
            if (!tieneLlaveAtico) {
              mostrarAlerta('La escotilla está cerrada con candado. Necesitas la Llave del Ático (busca en el microondas de la Cocina).');
            } else {
              cambiarHabitacion('attic');
              mostrarAlerta("Subiste al Ático...");
            }
          }}
          style={{ top: '1%', left: '33%', width: '33%', height: '25%', zIndex: 50, cursor: 'pointer', background: 'transparent', border: 'none', outline: 'none' }}
        >
          <span className="zone-tooltip">{tieneLlaveAtico ? "🪜 Subir al Ático" : "🪜 Escotilla (Requiere Llave del Ático)"}</span>
        </button>

        {/* 3. Puerta del Fondo / Pasillo (Cruzar al Siguiente Bucle) */}
        <button 
          type="button"
          className="interactive-zone move"
          onClick={() => {
            if (bucleActual === 3 && !tieneLlaveOxidada) {
              mostrarAlerta('La puerta del pasillo está bloqueada. Necesitas la Llave Oxidada del Baño para abrir la cerradura...');
            } else {
              cruzarPuerta();
            }
          }}
          style={{ top: '36%', left: '42%', width: '15%', height: '34%', zIndex: 50, cursor: 'pointer', background: 'transparent', border: 'none', outline: 'none' }}
        >
          <span className="zone-tooltip">🚪 Cruzar Pasillo</span>
        </button>

        {/* 4. Puerta del Sótano (Puerta de madera con cadenas y cartel "BASEMENT") */}
        <button 
          type="button"
          className="interactive-zone move"
          onClick={() => {
            if (bucleActual === 3 && !tieneLlaveOxidada) {
              mostrarAlerta('La puerta del sótano está encadenada. Necesitas la Llave Oxidada del Baño...');
            } else {
              cambiarHabitacion('basement');
              mostrarAlerta("Bajaste al Sótano...");
            }
          }}
          style={{ top: '35%', left: '59%', width: '11%', height: '39%', zIndex: 50, cursor: 'pointer', background: 'transparent', border: 'none', outline: 'none' }}
        >
          <span className="zone-tooltip">⛓️ Sótano</span>
        </button>

        {/* 5. Puerta y Entrada del Baño (Puerta derecha con cartel "BATHROOM") */}
        <button 
          type="button"
          className="interactive-zone move"
          onClick={() => {
            cambiarHabitacion('bathroom');
            mostrarAlerta("Entraste al Baño...");
          }}
          style={{ top: '5%', left: '68%', width: '32%', height: '90%', zIndex: 50, cursor: 'pointer', background: 'transparent', border: 'none', outline: 'none' }}
        >
          <span className="zone-tooltip">🚪 Baño</span>
        </button>

        {/* 6. Candado final en Bucle 5 */}
        {bucleActual === 5 && (
          <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.95)', padding: '25px', border: '3px solid red', zIndex: 40, borderRadius: '8px', boxShadow: '0 0 50px red' }}>
            <p style={{ color: 'red', fontSize: '1.2rem', textAlign: 'center', margin: '0 0 15px 0', fontWeight: 'bold' }}>CANDADO DEMONÍACO FINAL</p>
            <CombinationLock correctAnswer={estado.codigoSecreto} onUnlock={() => cruzarPuerta()} />
          </div>
        )}

        {/* 7. Botón Diegético Inferior para Avanzar el Bucle (Cruzar Pasillo) */}
        {bucleActual < 5 && (
          <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', zIndex: 40 }}>
            <button
              onClick={() => {
                if (bucleActual === 3 && !tieneLlaveOxidada) {
                  mostrarAlerta('El pasillo está bloqueado. Necesitas la Llave Oxidada del Baño para abrir la cerradura...');
                } else {
                  cruzarPuerta();
                }
              }}
              style={{
                backgroundColor: 'transparent',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                color: '#ffdddd',
                border: '1px solid rgba(255, 60, 60, 0.7)',
                padding: '12px 36px',
                fontFamily: "'VT323', monospace",
                fontSize: '1.35rem',
                cursor: 'pointer',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
                borderRadius: '6px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(180, 0, 0, 0.35)'; 
                e.currentTarget.style.borderColor = 'red';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.7)'; 
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseOut={(e) => { 
                e.currentTarget.style.backgroundColor = 'transparent'; 
                e.currentTarget.style.borderColor = 'rgba(255, 60, 60, 0.7)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.3)'; 
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              🌀 Cruzar al Siguiente Bucle (Bucle {bucleActual} → {bucleActual + 1})
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
