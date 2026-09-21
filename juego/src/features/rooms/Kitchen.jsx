import { useState } from 'react';

export const Kitchen = ({ acciones, estado, isTyping }) => {
  const { recibirSusto, cambiarHabitacion, recogerObjeto, leerNota } = acciones;
  const { inventory } = estado;
  
  const [fridgeOpen, setFridgeOpen] = useState(false);

  const handleFridgeClick = () => {
    if (!fridgeOpen) {
      setFridgeOpen(true);
      recibirSusto(15); // Pierdes cordura por el olor
      if (!inventory.includes('Cuchillo Ensangrentado')) {
        recogerObjeto('Cuchillo Ensangrentado');
      }
    }
  };

  const handleMicrowaveClick = () => {
    recibirSusto(25); // Fuerte jumpscare
    if (!inventory.includes('Llave del Ático')) {
      recogerObjeto('Llave del Ático');
      acciones.mostrarAlerta("¡Encontraste la Llave del Ático dentro del microondas ensangrentado!");
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
        title={fridgeOpen ? "Solo hay carne podrida..." : "Abrir refrigerador"}
        style={{ top: '30%', left: '10%', width: '20%', height: '50%' }}
      >
        {fridgeOpen && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(100,0,0,0.5)', zIndex: 1 }} />
        )}
      </div>

      {/* Microondas en el mostrador */}
      <div 
        className="interactive-zone move"
        onClick={handleMicrowaveClick}
        title="Inspeccionar el microondas parpadeante"
        style={{ top: '45%', left: '55%', width: '15%', height: '15%', border: '1px solid rgba(255,255,0,0.3)', boxShadow: '0 0 10px yellow' }}
      />

      {/* Nota de Lore en la mesa o mostrador */}
      <div 
        className="interactive-zone look"
        onClick={() => leerNota("TICKET DE COMPRA:\n- Carne (Mucha)\n- Cuchillos nuevos\n\nEl hambre no cesa. Tengo que seguir alimentándolo. Si dejo de hacerlo, me comerá a mí.")}
        title="Leer recibo de compra ensangrentado"
        style={{ top: '65%', left: '75%', width: '10%', height: '10%' }}
      />

      {/* Volver al pasillo */}
      <div 
        className="interactive-zone move"
        onClick={() => cambiarHabitacion('hallway')}
        title="Volver al pasillo"
        style={{ top: '80%', left: '40%', width: '20%', height: '15%' }}
      />
    </div>
  );
};
