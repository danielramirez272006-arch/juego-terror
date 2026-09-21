import { useState } from 'react';

export const Kitchen = ({ acciones, estado }) => {
  const { recibirSusto, cambiarHabitacion, recogerObjeto, leerNota } = acciones;
  const { inventory } = estado;
  
  const [fridgeOpen, setFridgeOpen] = useState(false);

  const tieneLlaveAtico = inventory && inventory.some(i => i.toLowerCase().includes('tico') || i.includes('Ático'));

  const handleFridgeClick = () => {
    if (!fridgeOpen) {
      setFridgeOpen(true);
      recibirSusto(15); // Pierdes cordura por el olor
      if (!inventory.includes('Cuchillo Ensangrentado')) {
        recogerObjeto('Cuchillo Ensangrentado');
        acciones.mostrarAlerta("¡Tomaste el Cuchillo Ensangrentado del refrigerador!");
      }
    }
  };

  const handleMicrowaveClick = () => {
    recibirSusto(20); // Jumpscare
    if (!tieneLlaveAtico) {
      recogerObjeto('Llave del Ático');
      acciones.mostrarAlerta("¡Obtuviste la Llave del Ático! Ahora puedes subir por la escotilla en el Pasillo.");
    } else {
      acciones.mostrarAlerta("El microondas está quemado y ensangrentado. Ya tienes la Llave del Ático.");
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: 'url(/kitchen.jpg)',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      {/* Refrigerador a la izquierda */}
      <div 
        className={`interactive-zone ${fridgeOpen ? 'look' : 'grab'}`}
        onClick={handleFridgeClick}
        style={{ top: '22%', left: '0%', width: '38%', height: '68%', zIndex: 15 }}
      >
        <span className="zone-tooltip">{fridgeOpen ? "🥩 Refrigerador" : "❄️ Abrir Refrigerador"}</span>
        {fridgeOpen && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(100,0,0,0.5)', zIndex: 1 }} />
        )}
      </div>

      {/* Microondas en el mostrador */}
      <div 
        className="interactive-zone move"
        onClick={handleMicrowaveClick}
        style={{ top: '43%', left: '56%', width: '24%', height: '18%', zIndex: 15 }}
      >
        <span className="zone-tooltip">{tieneLlaveAtico ? "⚡ Microondas (Vacío)" : "⚡ Microondas (Tomar Llave del Ático)"}</span>
      </div>

      {/* Nota de Lore en la mesa o mostrador */}
      <div 
        className="interactive-zone look"
        onClick={() => leerNota("TICKET DE COMPRA:\n- Carne (Mucha)\n- Cuchillos nuevos\n\nEl hambre no cesa. Tengo que seguir alimentándolo. Si dejo de hacerlo, me comerá a mí.")}
        style={{ top: '65%', left: '60%', width: '30%', height: '22%', zIndex: 15 }}
      >
        <span className="zone-tooltip">📜 Leer Nota Ensangrentada</span>
      </div>

      {/* Volver al pasillo (puerta visible a la derecha) */}
      <div 
        className="interactive-zone move"
        onClick={() => cambiarHabitacion('hallway')}
        style={{ top: '15%', left: '86%', width: '13%', height: '75%', zIndex: 15 }}
      >
        <span className="zone-tooltip">🚪 Salir al Pasillo</span>
      </div>
    </div>
  );
};
