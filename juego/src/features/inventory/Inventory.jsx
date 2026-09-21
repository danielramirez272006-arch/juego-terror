export const Inventory = ({ items, onPecadosClick }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '25px',
      backgroundColor: 'rgba(10, 5, 5, 0.82)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 50, 50, 0.35)',
      borderRadius: '8px',
      padding: '12px 20px',
      color: '#fff',
      minWidth: '220px',
      zIndex: 1000,
      fontFamily: "'VT323', monospace",
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
    }}>
      <h3 style={{ margin: '0 0 8px 0', borderBottom: '1px solid rgba(255, 50, 50, 0.25)', paddingBottom: '4px', fontSize: '1.25rem', letterSpacing: '2px', color: '#ffaaaa' }}>
        🎒 INVENTARIO
      </h3>
      {items.length === 0 ? (
        <p style={{ color: '#888', margin: 0, fontSize: '1.05rem' }}>Tus bolsillos están vacíos...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map(item => (
            <li 
              key={item} 
              onClick={() => { if(item === "TUS PECADOS" && onPecadosClick) onPecadosClick() }}
              style={{ 
                marginBottom: '4px', 
                fontSize: '1.15rem',
                letterSpacing: '1px',
                color: item === "TUS PECADOS" ? '#ff3333' : '#e0e0e0',
                cursor: item === "TUS PECADOS" ? 'pointer' : 'default',
                textShadow: item === "TUS PECADOS" ? '0 0 8px red' : 'none',
                fontWeight: item === "TUS PECADOS" ? 'bold' : 'normal'
              }}
            >
              &gt; {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
