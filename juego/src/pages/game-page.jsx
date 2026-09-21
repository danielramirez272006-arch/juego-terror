import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '../features/game/use-game';
import { Inventory } from '../features/inventory/Inventory';
import { BlueScreen } from '../shared/components/BlueScreen';
import { EndingScreen } from '../shared/components/EndingScreen';
import { useSecretCode } from '../shared/hooks/use-secret-code';
import { useGlobalContext } from '../shared/context/GlobalContext';
import { useTypewriter } from '../shared/hooks/useTypewriter';

// Importar los componentes de habitaciones
import { Hallway } from '../features/rooms/Hallway';
import { Bathroom } from '../features/rooms/Bathroom';
import { Basement } from '../features/rooms/Basement';
import { Kitchen } from '../features/rooms/Kitchen';
import { Attic } from '../features/rooms/Attic';

const animacionesYFiltros = `
  @keyframes staticNoise {
    0% { opacity: 0.1; transform: translate(1px, 1px); }
    50% { opacity: 0.2; transform: translate(-2px, -2px); }
    100% { opacity: 0.1; transform: translate(1px, -1px); }
  }
  @keyframes heartbeat {
    0% { box-shadow: inset 0 0 0px red; }
    50% { box-shadow: inset 0 0 50px red; }
    100% { box-shadow: inset 0 0 0px red; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes jumpscareViolent {
    0% { transform: scale(1); filter: invert(0) hue-rotate(0deg) brightness(1); }
    20% { transform: scale(1.5) translate(-30px, 20px); filter: invert(1) hue-rotate(90deg) brightness(2); }
    40% { transform: scale(1.1) translate(30px, -20px); filter: invert(0) hue-rotate(0deg) brightness(0.5); }
    60% { transform: scale(1.8) translate(-20px, -30px); filter: invert(1) hue-rotate(180deg) brightness(3); }
    80% { transform: scale(1.3) translate(20px, 30px); filter: invert(0) hue-rotate(0deg) brightness(1); }
    100% { transform: scale(2); filter: invert(1) hue-rotate(270deg) brightness(1.5); }
  }
  
  .game-container {
    position: relative;
    min-height: 100vh;
    padding: 2rem;
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    overflow: hidden;
    perspective: 1000px;
  }
  
  .room-3d-wrapper {
    transition: transform 0.1s ease-out;
    transform-style: preserve-3d;
  }
  
  /* Linterna: viñeta radial */
  .flashlight-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 10;
  }
  
  .jumpscare-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background-image: url('/ghost.jpg');
    background-size: cover;
    background-position: center;
    z-index: 9999;
    pointer-events: none;
    animation: jumpscareViolent 0.1s infinite, staticNoise 0.05s infinite;
    mix-blend-mode: hard-light;
  }
  
  .room-container {
    max-width: 600px;
    margin: 0 auto;
    font-size: 1.2rem;
    line-height: 1.5;
  }
`;

export default function GamePage() {
  const { nivel } = useParams();
  const { nombreJugador, playerImage } = useGlobalContext();
  const nivelInicial = parseInt(nivel) || 1;

  const { estado, acciones } = useGame(nivelInicial);
  const { bucleActual, sanity, room, estadoSusto, tiempoTranscurrido, loading, errorGlobal, inventory, mensajeAlerta, transitioning, victoria, notaActiva } = estado;

  // Huevo de pascua: Si escribes "DIE" pierdes automáticamente
  useSecretCode("DIE", () => {
    acciones.mostrarAlerta("Has elegido tu propio final...");
    acciones.recibirSusto(100);
  });

  const flashlightRef = useRef(null);
  const roomWrapperRef = useRef(null);
  const [isBlackout, setIsBlackout] = useState(false);

  const handleMouseMove = (e) => {
    if (isBlackout) return;
    
    if (flashlightRef.current) {
      const radius = corduraBaja ? '150px' : '300px';
      flashlightRef.current.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, transparent 0%, rgba(0,0,0,0.98) ${radius})`;
    }
    
    if (roomWrapperRef.current) {
      const px = (e.clientX / window.innerWidth) - 0.5;
      const py = (e.clientY / window.innerHeight) - 0.5;
      roomWrapperRef.current.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg) scale(1.05)`;
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && notaActiva) {
        acciones.cerrarNota();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notaActiva, acciones]);

  const corduraBaja = sanity < 50;
  const corduraCritica = sanity < 20;
  const pantallaAzulMode = sanity > 0 && sanity <= 5; // BSOD Falso cuando estás a punto de morir

  // Efecto de linterna parpadeante al azar si la cordura baja
  useEffect(() => {
    if (corduraBaja) {
      const randomTime = Math.random() * 5000 + 2000;
      const timer = setTimeout(() => {
        setIsBlackout(true);
        setTimeout(() => setIsBlackout(false), Math.random() * 500 + 100);
      }, randomTime);
      return () => clearTimeout(timer);
    }
  }, [corduraBaja, isBlackout]);

  // Eliminar getFlashlightGradient porque ahora se controla por referencia

  const getRoomText = () => {
    switch (room) {
      case 'hallway': return "Estás en el pasillo principal. El papel tapiz está despegado y el silencio es ensordecedor. Alguien te observa.";
      case 'bathroom': return "El baño está oscuro. Huele a humedad. Sientes que alguien está detrás de ti...";
      case 'basement': return "Has bajado al sótano. Hay un monstruo cerca. El micrófono está ACTIVO. NO HAGAS NINGÚN RUIDO.";
      case 'kitchen': return "La cocina está asquerosamente sucia. Huele a carne podrida. Hay cuchillos en la encimera.";
      case 'attic': return "El ático está lleno de polvo y cajas. Apenas puedes ver. Algo se mueve en la oscuridad.";
      default: return "";
    }
  };

  const { displayedText, isTyping } = useTypewriter(getRoomText(), 30, sanity < 40);

  const renderRoom = () => {
    switch (room) {
      case 'hallway':
        return <Hallway acciones={acciones} estado={estado} isTyping={isTyping} />;
      case 'bathroom':
        return <Bathroom acciones={acciones} estado={estado} isTyping={isTyping} />;
      case 'basement':
        return <Basement acciones={acciones} estado={estado} isTyping={isTyping} />;
      case 'kitchen':
        return <Kitchen acciones={acciones} estado={estado} isTyping={isTyping} />;
      case 'attic':
        return <Attic acciones={acciones} estado={estado} isTyping={isTyping} />;
      default:
        return <Hallway acciones={acciones} estado={estado} isTyping={isTyping} />;
    }
  };

  if (pantallaAzulMode) {
    return <BlueScreen />;
  }

  if (victoria) {
    return <EndingScreen sanity={sanity} tiempoTranscurrido={tiempoTranscurrido} badEnding={inventory.includes("TUS PECADOS")} />;
  }

  return (
    <div className={`game-container ${sanity < 30 ? 'low-sanity-distortion' : ''}`} onMouseMove={handleMouseMove} style={{
      backgroundColor: estadoSusto || isBlackout ? '#000' : '#050505',
      filter: corduraCritica && !isBlackout ? 'sepia(0.8) hue-rotate(-30deg) saturate(2)' : 'none',
      animation: corduraCritica && !estadoSusto && !isBlackout ? 'heartbeat 1s infinite' : 'none',
      opacity: isBlackout ? 0 : 1,
      padding: 0 // Remove padding to allow full screen backgrounds
    }}>
      <style>{animacionesYFiltros}</style>

      {/* OVERLAY DE JUMP SCARE */}
      {estadoSusto && (
        <div className="jumpscare-overlay" style={{ backgroundImage: `url(${playerImage || '/ghost.jpg'})` }} />
      )}

      {/* Contenedor Parallax 3D */}
      <div 
        ref={roomWrapperRef}
        className="room-3d-wrapper" 
        style={{
          transform: `rotateY(0deg) rotateX(0deg) scale(1.05)`,
          height: '100vh',
          width: '100vw'
        }}
      >
        
        {/* Renderizado Dinámico de la Zona ocupa todo el fondo */}
        {renderRoom()}

        {/* UI Superior (HUD Diegético) */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', zIndex: 20, pointerEvents: 'none' }}>
          <h2 style={{ color: corduraCritica ? 'red' : 'white', textShadow: '2px 2px 4px #000' }}>Cordura: {Math.floor(sanity)}%</h2>
          <h2 style={{ color: 'white', textShadow: '2px 2px 4px #000' }}>Tiempo: {tiempoTranscurrido}s</h2>
          <h2 style={{ color: 'white', textShadow: '2px 2px 4px #000' }}>Bucle: {bucleActual}</h2>
        </div>

        {/* Notificación Diegética (reemplazo de alert) */}
        {mensajeAlerta && (
          <div style={{ 
            position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', 
            backgroundColor: 'rgba(50, 0, 0, 0.9)', border: '2px solid red', padding: '20px 40px', 
            borderRadius: '10px', zIndex: 9999, animation: 'fadeIn 0.5s', textAlign: 'center'
          }}>
            <h1 style={{ color: 'red', textShadow: '0 0 10px darkred', margin: 0 }}>{mensajeAlerta}</h1>
          </div>
        )}

        {errorGlobal && (
          <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255,0,0,0.8)', color: 'white', padding: '10px', zIndex: 20 }}>
            Error: {errorGlobal}
          </div>
        )}

        {notaActiva && (
          <div 
            style={{ 
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
              backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9995, display: 'flex', 
              justifyContent: 'center', alignItems: 'center', pointerEvents: 'auto' 
            }}
            onClick={() => acciones.cerrarNota()}
          >
            <div style={{
              backgroundColor: '#e6dabb', padding: '40px', width: '80%', maxWidth: '500px',
              borderRadius: '5px', boxShadow: '0 0 30px rgba(255,0,0,0.2)',
              color: '#300', fontFamily: "'Brush Script MT', cursive, sans-serif", fontSize: '1.8rem',
              lineHeight: '1.5', transform: 'rotate(-2deg)', position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '1.2rem', fontFamily: 'sans-serif', cursor: 'pointer', color: '#900' }}>[X]</div>
              {notaActiva.split('\n').map((line, i) => <p key={i} style={{margin: '10px 0'}}>{line}</p>)}
            </div>
          </div>
        )}

        {loading && (
          <h2 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'yellow', zIndex: 20 }}>Procesando tu destino...</h2>
        )}

      </div>

      {/* Efecto Linterna / Viñeta que cubre todo excepto el haz de luz */}
      <div 
        ref={flashlightRef}
        className="flashlight-overlay" 
        style={{ 
          background: isBlackout ? '#000' : `radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.98) ${corduraBaja ? '150px' : '300px'})`, 
          zIndex: 10,
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none'
        }} 
      />

      {/* Texto Descriptivo Global (Fuera de la oscuridad de la linterna) */}
      <div style={{ position: 'absolute', bottom: '15%', left: '10%', right: '10%', backgroundColor: 'rgba(0,0,0,0.85)', padding: '20px', borderRadius: '10px', zIndex: 30, border: '1px solid #333', boxShadow: '0 0 20px rgba(0,0,0,0.9)', pointerEvents: 'none' }}>
        <p style={{ minHeight: '60px', margin: 0, textShadow: '2px 2px 4px #000', fontSize: '1.4rem' }}>{displayedText}</p>
        {room === 'basement' && !isTyping && (
          <p style={{ color: 'yellow', marginTop: '10px', fontSize: '1rem', textShadow: '0 0 5px black', animation: 'fadeIn 1s' }}>
            ⚠️ Tu micrófono te está escuchando. Mantente en absoluto silencio.
          </p>
        )}
      </div>

      {/* Transición de Fade to Black con estática */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: '#000', opacity: transitioning ? 1 : 0,
        backgroundImage: transitioning ? 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")' : 'none',
        transition: 'opacity 0.2s ease-in-out', pointerEvents: 'none', zIndex: 9990
      }} />

      {/* Efecto Estática persistente si hay baja cordura */}
      {(estadoSusto || corduraBaja) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'repeating-radial-gradient(#000 0 0.0001%,#fff 0 0.0002%)',
          backgroundSize: '100% 100%',
          animation: 'staticNoise 0.1s infinite',
          pointerEvents: 'none',
          zIndex: 15,
          opacity: 0.3
        }} />
      )}

      {/* UI Inferior / Inventario */}
      <Inventory items={inventory} onPecadosClick={() => acciones.recibirSusto(20)} />
    </div>
  );
}
