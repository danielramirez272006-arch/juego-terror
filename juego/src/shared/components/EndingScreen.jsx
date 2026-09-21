import { Link } from 'react-router-dom';

export const EndingScreen = ({ sanity, tiempoTranscurrido, badEnding }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundImage: badEnding ? 'url(/hallway_corrupt.jpg)' : 'url(/escape.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      fontFamily: "'Courier New', Courier, monospace",
      color: 'white',
      backgroundColor: 'black'
    }}>
      <div style={{
        backgroundColor: badEnding ? 'rgba(50, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        padding: '50px',
        borderRadius: '10px',
        textAlign: 'center',
        border: badEnding ? '2px solid red' : '1px solid #333',
        boxShadow: badEnding ? '0 0 100px red' : '0 0 50px rgba(0,0,0,0.8)'
      }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0', textShadow: '2px 2px 5px black', color: badEnding ? 'darkred' : 'white' }}>
          {badEnding ? "NUNCA ESCAPARÁS" : "Has Escapado..."}
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px', color: badEnding ? 'red' : 'white' }}>
          {badEnding ? "Cargaste con tus pecados. El bosque era una ilusión." : "Por ahora."}
        </p>
        
        <div style={{ margin: '40px 0', fontSize: '1.5rem', color: '#aaa' }}>
          <p>Tiempo Atrapado: <strong style={{ color: 'white' }}>{tiempoTranscurrido}s</strong></p>
          <p>Cordura Restante: <strong style={{ color: sanity < 20 ? 'red' : 'white' }}>{Math.floor(sanity)}%</strong></p>
        </div>

        <Link to="/puntajes" style={{
          display: 'inline-block',
          padding: '15px 30px',
          backgroundColor: '#4a0000',
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.2rem',
          border: '1px solid red',
          cursor: 'pointer',
          transition: 'all 0.3s',
          textTransform: 'uppercase'
        }}
        onMouseOver={(e) => { e.target.style.backgroundColor = 'red'; e.target.style.boxShadow = '0 0 15px red'; }}
        onMouseOut={(e) => { e.target.style.backgroundColor = '#4a0000'; e.target.style.boxShadow = 'none'; }}
        >
          Ver Muro de los Lamentos
        </Link>
      </div>
    </div>
  );
};
