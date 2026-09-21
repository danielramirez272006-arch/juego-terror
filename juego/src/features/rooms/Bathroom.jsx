import { useState } from 'react';

export const Bathroom = ({ acciones, estado }) => {
  const { recibirSusto = () => {}, cambiarHabitacion = () => {}, recogerObjeto = () => {}, mostrarAlerta = () => {} } = acciones || {};
  const { inventory = [], codigoSecreto } = estado || {};

  const [espejoLimpio, setEspejoLimpio] = useState(false);

  const tieneLlaveOxidada = Boolean(inventory && inventory.some(i => 
    i.toLowerCase().includes('oxidada') || 
    i === 'Llave Oxidada'
  ));

  const codigoFormateado = Array.isArray(codigoSecreto) ? codigoSecreto.join('-') : (codigoSecreto || '7-4-2');

  const handleMirrorClick = () => {
    setEspejoLimpio(true);
    recibirSusto(10);
    mostrarAlerta(`Código revelado en el espejo: ${codigoFormateado}`);
  };

  const handleSinkClick = () => {
    if (!tieneLlaveOxidada) {
      recogerObjeto('Llave Oxidada');
      mostrarAlerta("¡Tomaste la Llave Oxidada del lavabo! (Abre el Sótano)");
    } else {
      mostrarAlerta("El lavabo gotea agua sucia. Ya tienes la Llave Oxidada.");
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: 'url(/bathroom.jpg)',
      backgroundColor: '#0a0a0a',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      {/* 1. Espejo del Baño */}
      <div 
        className="interactive-zone look"
        onClick={handleMirrorClick}
        style={{ top: '12%', left: '30%', width: '25%', height: '35%', zIndex: 15, cursor: 'pointer' }}
      >
        <span className="zone-tooltip">🔍 {espejoLimpio ? `Código: ${codigoFormateado}` : "Limpiar Espejo"}</span>
        {espejoLimpio && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red', fontSize: '2.5rem', fontFamily: 'Courier New', fontWeight: 'bold', textShadow: '0 0 10px red', userSelect: 'none', pointerEvents: 'none' }}>
            {codigoFormateado}
          </div>
        )}
      </div>

      {/* 2. Lavabo / Recoger Llave Oxidada */}
      <div 
        className={`interactive-zone ${tieneLlaveOxidada ? 'look' : 'grab'}`}
        onClick={handleSinkClick}
        style={{ top: '48%', left: '33%', width: '25%', height: '26%', zIndex: 15, cursor: 'pointer' }}
      >
        <span className="zone-tooltip">{tieneLlaveOxidada ? "💧 Lavabo" : "🔑 Tomar Llave Oxidada"}</span>
      </div>

      {/* 3. Puerta para volver al pasillo */}
      <div 
        className="interactive-zone move"
        onClick={() => {
          cambiarHabitacion('hallway');
          mostrarAlerta("Regresaste al Pasillo...");
        }}
        style={{ top: '15%', left: '4%', width: '18%', height: '75%', zIndex: 15, cursor: 'pointer' }}
      >
        <span className="zone-tooltip">🚪 Salir al Pasillo</span>
      </div>
    </div>
  );
};
