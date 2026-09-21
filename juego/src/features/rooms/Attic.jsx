import { useEffect, useState } from 'react';

export const Attic = ({ acciones, estado, isTyping }) => {
  const { recibirSusto, cambiarHabitacion, recogerObjeto, mostrarAlerta } = acciones;
  const { inventory, sanity } = estado;
  
  const [chestOpen, setChestOpen] = useState(false);

  // Drenaje pasivo de cordura por la claustrofobia
  useEffect(() => {
    const drainInterval = setInterval(() => {
      if (sanity > 0) {
        recibirSusto(2); // Drena lentamente
      }
    }, 2000);
    return () => clearInterval(drainInterval);
  }, [sanity, recibirSusto]);

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
      {!isTyping && (
        <>
          {/* Mecedora fantasma a la derecha */}
          <div 
            className="interactive-zone look"
            onClick={handleRockingChairClick}
            title="Inspeccionar la mecedora cubierta"
            style={{ top: '40%', left: '70%', width: '25%', height: '50%' }}
          />

          {/* Baúl / Caja de objetos */}
          <div 
            className={`interactive-zone ${chestOpen ? 'look' : 'grab'}`}
            onClick={handleChestClick}
            title={chestOpen ? "El baúl está vacío" : "Abrir baúl polvoriento"}
            style={{ top: '60%', left: '25%', width: '20%', height: '25%' }}
          />

          {/* Bajar de regreso al pasillo */}
          <div 
            className="interactive-zone move"
            onClick={() => cambiarHabitacion('hallway')}
            title="Bajar rápido por la escotilla al pasillo"
            style={{ top: '80%', left: '40%', width: '20%', height: '15%' }}
          />
        </>
      )}
    </div>
  );
};
