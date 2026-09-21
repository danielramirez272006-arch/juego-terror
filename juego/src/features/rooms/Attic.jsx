import { useEffect, useState } from 'react';

export const Attic = ({ acciones, estado }) => {
  const { recibirSusto, bajarCordura, cambiarHabitacion, recogerObjeto, mostrarAlerta } = acciones;
  const { inventory } = estado;
  
  const [chestOpen, setChestOpen] = useState(false);

  // Drenaje pasivo de cordura por la claustrofobia
  useEffect(() => {
    const drainInterval = setInterval(() => {
      if (bajarCordura) {
        bajarCordura(1.5);
      }
    }, 2000);
    return () => clearInterval(drainInterval);
  }, [bajarCordura]);

  const handleRockingChairClick = () => {
    if (inventory.includes('Cuchillo Ensangrentado')) {
      mostrarAlerta("¡ALGO INTENTÓ ATACARTE, PERO LO APUÑALASTE CON EL CUCHILLO!");
      // No pierde cordura
    } else {
      recibirSusto(40); // Fuerte jumpscare
      mostrarAlerta("¡ALGO TE ATACÓ! Necesitas algo para defenderte...");
    }
  };

  const handleChestClick = () => {
    if (!chestOpen) {
      setChestOpen(true);
      if (!inventory.includes('Encendedor')) {
        recogerObjeto('Encendedor');
        mostrarAlerta("Has encontrado un Encendedor antiguo.");
      }
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: 'url(/attic.jpg)',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      {/* Bajar de regreso al pasillo (Escotilla/Escalera a la izquierda) */}
      <div 
        className="interactive-zone move"
        onClick={() => cambiarHabitacion('hallway')}
        style={{ top: '15%', left: '5%', width: '18%', height: '75%', zIndex: 15 }}
      >
        <span className="zone-tooltip">🪜 Bajar al Pasillo</span>
      </div>

      {/* Mecedora fantasma a la derecha */}
      <div 
        className="interactive-zone look"
        onClick={handleRockingChairClick}
        style={{ top: '35%', left: '65%', width: '25%', height: '55%' }}
      >
        <span className="zone-tooltip">🪑 Mecedora Cubierta</span>
      </div>

      {/* Baúl / Caja de objetos */}
      <div 
        className={`interactive-zone ${chestOpen ? 'look' : 'grab'}`}
        onClick={handleChestClick}
        style={{ top: '55%', left: '25%', width: '25%', height: '30%' }}
      >
        <span className="zone-tooltip">{chestOpen ? "📦 Baúl Vacío" : "🗝️ Abrir Baúl"}</span>
      </div>
    </div>
  );
};
