import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LOCAL_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/scores';

export default function Leaderboard() {
  const [puntajes, setPuntajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(LOCAL_API_URL)
      .then(res => {
        if (!res.ok) throw new Error(`Respuesta del servidor no exitosa (${res.status})`);
        return res.json();
      })
      .then(data => {
        // Inmutabilidad: crear copia antes de ordenar
        const ordenados = [...data].sort((a, b) => {
          if (b.nivel !== a.nivel) return b.nivel - a.nivel;
          return a.tiempo - b.tiempo;
        });
        setPuntajes(ordenados);
      })
      .catch(err => {
        console.error("Error al cargar puntajes:", err);
        setError("No se pudo conectar con el servidor de puntajes local (json-server).");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundImage: 'url(/hallway.jpg)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
      fontFamily: "'Courier New', Courier, monospace",
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '50px 20px',
      position: 'relative',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      {/* Overlay oscuro para textura */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10, 0, 0, 0.85)', zIndex: 1, pointerEvents: 'none' }} />

      <div style={{ zIndex: 2, maxWidth: '800px', width: '100%', textAlign: 'center', position: 'relative' }}>
        <h1 style={{ 
          fontSize: '3rem', color: '#ff3333', textShadow: '0 0 20px darkred',
          borderBottom: '2px solid darkred', paddingBottom: '20px', marginBottom: '40px',
          letterSpacing: '3px', textTransform: 'uppercase'
        }}>
          El Muro de los Lamentos
        </h1>

        {loading && (
          <h2 style={{ color: '#aaa', fontStyle: 'italic' }}>Revelando las inscripciones...</h2>
        )}

        {error && (
          <div style={{
            backgroundColor: 'rgba(80, 0, 0, 0.8)',
            border: '2px solid red',
            color: '#ffcccc',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px',
            boxShadow: '0 0 20px rgba(255,0,0,0.4)'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '1.2rem' }}>⚠️ Error en el Registro de Almas</p>
            <p style={{ margin: 0, fontSize: '1rem', color: '#ff8888' }}>{error}</p>
          </div>
        )}

        {!loading && !error && (
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
                    borderRadius: '5px',
                    transition: 'all 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.15)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = i === 0 ? 'rgba(139,0,0,0.2)' : 'transparent'; }}
                  >
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
            color: '#ffaaaa', border: '1px solid #700', textDecoration: 'none',
            fontSize: '1.2rem', transition: 'all 0.3s', cursor: 'pointer',
            borderRadius: '6px'
          }}
          onMouseOver={(e) => { 
            e.currentTarget.style.color = '#fff'; 
            e.currentTarget.style.borderColor = 'red';
            e.currentTarget.style.backgroundColor = 'rgba(180, 0, 0, 0.3)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
          }}
          onMouseOut={(e) => { 
            e.currentTarget.style.color = '#ffaaaa'; 
            e.currentTarget.style.borderColor = '#700';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            🚪 Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
