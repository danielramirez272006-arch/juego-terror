import { useState } from 'react';

export const CombinationLock = ({ correctAnswer = [6, 6, 6], onUnlock }) => {
  const [digits, setDigits] = useState([0, 0, 0]);
  const [locked, setLocked] = useState(true);
  const [error, setError] = useState(false);

  const spin = (index, direction) => {
    if (!locked) return;
    setDigits((prev) => {
      const newDigits = [...prev];
      if (direction === 'up') {
        newDigits[index] = newDigits[index] === 9 ? 0 : newDigits[index] + 1;
      } else {
        newDigits[index] = newDigits[index] === 0 ? 9 : newDigits[index] - 1;
      }
      return newDigits;
    });
    setError(false);
  };

  const checkLock = () => {
    if (digits.every((val, index) => val === correctAnswer[index])) {
      setLocked(false);
      onUnlock();
    } else {
      setError(true);
      // Animación de error en CSS
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div style={{
      backgroundColor: '#1a0505', padding: '30px', borderRadius: '15px', 
      border: '4px solid #3e0a0a', textAlign: 'center', width: '350px', margin: '20px auto',
      boxShadow: 'inset 0 0 20px #000, 0 0 30px rgba(255,0,0,0.3)',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
      position: 'relative'
    }}>
      <h3 style={{ color: 'red', margin: '0 0 25px 0', textShadow: '2px 2px 4px #000', fontSize: '1.8rem', fontFamily: "'Courier New', Courier, monospace", textTransform: 'uppercase' }}>
        Candado Ensangrentado
      </h3>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
        {digits.map((digit, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button className="interactive-zone move" onClick={() => spin(index, 'up')} style={{ position: 'relative', background: 'transparent', border: 'none', color: '#550000', fontSize: '2rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='red'} onMouseOut={(e) => e.target.style.color='#550000'}>▲</button>
            <div style={{ 
              fontSize: '3.5rem', fontWeight: 'bold', border: '2px solid #550000', padding: '10px 15px', 
              width: '60px', backgroundColor: '#0a0000', color: '#ff3333',
              boxShadow: 'inset 0 0 10px #000', textShadow: '0 0 5px red'
            }}>
              {digit}
            </div>
            <button className="interactive-zone move" onClick={() => spin(index, 'down')} style={{ position: 'relative', background: 'transparent', border: 'none', color: '#550000', fontSize: '2rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='red'} onMouseOut={(e) => e.target.style.color='#550000'}>▼</button>
          </div>
        ))}
      </div>
      <button 
        className="interactive-zone move"
        onClick={checkLock}
        style={{
          position: 'relative',
          width: '100%', padding: '15px', fontSize: '1.3rem', fontWeight: 'bold',
          backgroundColor: error ? '#4a0000' : '#220000', 
          color: '#ff6666', border: '1px solid #ff0000', cursor: 'pointer',
          transition: 'all 0.3s',
          animation: error ? 'shake 0.5s' : 'none',
          textShadow: '0 0 5px red'
        }}
        onMouseOver={(e) => { e.target.style.backgroundColor = '#4a0000'; e.target.style.boxShadow = '0 0 15px red'; }}
        onMouseOut={(e) => { e.target.style.backgroundColor = error ? '#4a0000' : '#220000'; e.target.style.boxShadow = 'none'; }}
      >
        {locked ? 'INTENTAR ABRIR' : 'DESBLOQUEADO'}
      </button>
      
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(5px); }
          50% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
