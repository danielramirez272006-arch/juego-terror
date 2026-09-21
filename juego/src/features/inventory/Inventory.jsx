export const Inventory = ({ items, onPecadosClick }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid #444',
      padding: '15px',
      color: '#fff',
      minWidth: '200px',
      zIndex: 1000,
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Inventario</h3>
      {items.length === 0 ? (
        <p style={{ color: '#888', margin: 0 }}>Tus bolsillos están vacíos...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map(item => (
            <li 
              key={item} 
              onClick={() => { if(item === "TUS PECADOS" && onPecadosClick) onPecadosClick() }}
              style={{ 
                marginBottom: '5px', 
                color: item === "TUS PECADOS" ? 'red' : 'white',
                cursor: item === "TUS PECADOS" ? 'pointer' : 'default',
                textShadow: item === "TUS PECADOS" ? '0 0 5px darkred' : 'none',
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
