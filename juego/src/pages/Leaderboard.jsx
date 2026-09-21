import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LOCAL_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/scores';

export default function Leaderboard() {
  const [puntajes, setPuntajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(LOCAL_API_URL)
      .then(res => res.json())
      .then(data => {
        // Ordenar por nivel (descendente) y luego por tiempo (ascendente)
        const ordenados = data.sort((a, b) => {
          if (b.nivel !== a.nivel) return b.nivel - a.nivel;
          return a.tiempo - b.tiempo;
        });
        setPuntajes(ordenados);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(/hallway.jpg)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      fontFamily: "'Courier New', Courier, monospace",
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '50px 20px',
      position: 'relative'
    }}>
      {/* Overlay oscuro para textura */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10, 0, 0, 0.85)', zIndex: 1 }} />

      <div style={{ zIndex: 2, maxWidth: '800px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '3rem', color: '#ff3333', textShadow: '0 0 20px darkred',
          borderBottom: '2px solid darkred', paddingBottom: '20px', marginBottom: '40px',
          letterSpacing: '3px', textTransform: 'uppercase'
        }}>
          El Muro de los Lamentos
        </h1>

        {loading ? (
          <h2 style={{ color: '#888' }}>Revelando las inscripciones...</h2>
        ) : (
          <div style={{ backgroundColor: 'rgba(20, 0, 0, 0.6)', padding: '30px', borderRadius: '15px', border: '1px solid #300', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.9)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #550000', paddingBottom: '10px', marginBottom: '20px', color: '#ff8888', fontWeight: 'bold' }}>
              <span style={{ flex: 1, textAlign: 'left' }}>Sujeto</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Bucle</span>
              <span style={{ flex: 1, textAlign: 'right' }}>Tiempo (s)</span>
            </div>
            
            {puntajes.length === 0 ? (
              <p style={{ color: '#555', fontStyle: 'italic', margin: '40px 0' }}>No hay rastros de sangre aún...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {puntajes.map((p, i) => (
                  <div key={p.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', padding: '10px',
                    backgroundColor: i === 0 ? 'rgba(139,0,0,0.2)' : 'transparent',
                    border: i === 0 ? '1px solid darkred' : 'none',
                    borderRadius: '5px'
                  }}>
                    <span style={{ flex: 1, textAlign: 'left', color: i === 0 ? '#ff3333' : '#aaa' }}>{p.nombre}</span>
                    <span style={{ flex: 1, textAlign: 'center', color: p.nivel >= 5 ? '#ff3333' : '#aaa' }}>{p.nivel >= 5 ? 'ESCAPÓ' : p.nivel}</span>
                    <span style={{ flex: 1, textAlign: 'right', color: '#888' }}>{p.tiempo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '50px' }}>
          <Link to="/" style={{
            display: 'inline-block', padding: '15px 40px', backgroundColor: 'transparent',
            color: '#888', border: '1px solid #444', textDecoration: 'none',
            fontSize: '1.2rem', transition: 'all 0.3s'
          }}
          onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = '#fff'; }}
          onMouseOut={(e) => { e.target.style.color = '#888'; e.target.style.borderColor = '#444'; }}
          >
            Volver a la Pesadilla
          </Link>
        </div>
      </div>
    </div>
  );
}
