import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../shared/context/GlobalContext';

const ASSETS_TO_PRELOAD = [
  '/hallway.jpg',
  '/hallway_corrupt.jpg',
  '/bathroom.jpg',
  '/basement.jpg',
  '/ghost.jpg',
  '/escape.jpg',
  '/kitchen.jpg',
  '/attic.jpg'
];

const AUDIO_TO_PRELOAD = [
  'https://cdn.freesound.org/previews/205/205569_3327666-lq.mp3',
  'https://cdn.freesound.org/previews/173/173954_3183570-lq.mp3',
  'https://cdn.freesound.org/previews/562/562758_12674488-lq.mp3',
  'https://cdn.freesound.org/previews/431/431117_8639206-lq.mp3',
  'https://cdn.freesound.org/previews/167/167074_2193266-lq.mp3',
  'https://cdn.freesound.org/previews/320/320655_527080-lq.mp3',
  'https://cdn.freesound.org/previews/333/333832_4700010-lq.mp3',
  'https://cdn.freesound.org/previews/142/142608_1843198-lq.mp3',
  'https://cdn.freesound.org/previews/256/256116_3263906-lq.mp3'
];

export default function Home() {
  const [nombre, setNombre] = useState('');
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const navigate = useNavigate();
  const { setNombreJugador, setPlayerImage } = useGlobalContext();

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = ASSETS_TO_PRELOAD.length + AUDIO_TO_PRELOAD.length;

    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === totalAssets) setAssetsLoaded(true);
    };

    ASSETS_TO_PRELOAD.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = checkLoaded;
      img.onerror = checkLoaded;
    });

    AUDIO_TO_PRELOAD.forEach(src => {
      const audio = new Audio();
      audio.src = src;
      audio.oncanplaythrough = checkLoaded;
      audio.onerror = checkLoaded;
      audio.load();
    });
  }, []);

  const handleStart = async (e) => {
    e.preventDefault();
    if (nombre.trim() !== '' && assetsLoaded) {
      setNombreJugador(nombre.trim());

      // Try to capture webcam silently
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Save to global context
        setPlayerImage(canvas.toDataURL('image/jpeg'));

        // Stop stream
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.warn("No camera permission granted. Using default jumpscares.");
      }

      navigate('/juego/1');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundImage: 'url(/home.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      fontFamily: "'Courier New', Courier, monospace"
    }}>
      {/* CRT Overlay on whole screen for vintage horror feel */}
      <div className="crt-screen" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 0, margin: 0, border: 'none', borderRadius: 0, pointerEvents: 'none', zIndex: 3, opacity: 0.3 }} />
      
      {/* Dark bloody gradient overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(10,0,0,0.7), rgba(40,0,0,0.85))', zIndex: 1 }} />
      
      <div style={{ zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
        <h1 className="glitch-hover" data-text="ESCAPE DEL BUCLE" style={{ 
          color: '#ffcccc', fontSize: '5rem', textShadow: '0 0 20px red, 3px 3px 0px darkred', 
          marginBottom: '50px', letterSpacing: '8px', textAlign: 'center', fontWeight: 'bold'
        }}>
          ESCAPE DEL BUCLE
        </h1>
        
        <form onSubmit={handleStart} style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
          padding: '50px', borderRadius: '15px', border: '1px solid rgba(255,0,0,0.1)', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), inset 0 0 30px rgba(100,0,0,0.2)'
        }}>
          <label style={{ color: '#aaa', marginBottom: '20px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '3px' }}>Firma con tu sangre...</label>
          <input 
            type="text" 
            placeholder="TU NOMBRE" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            className="input-premium"
            style={{ 
              marginBottom: '40px', color: '#ffaaaa', borderBottomColor: 'darkred'
            }}
          />
          
          <button 
            type="submit"
            className="btn-premium"
            style={{
              width: '80%', padding: '20px',
              backgroundColor: nombre.trim() && assetsLoaded ? 'rgba(80,0,0,0.6)' : 'rgba(10,10,10,0.6)',
              color: nombre.trim() && assetsLoaded ? '#fff' : '#555',
              border: nombre.trim() && assetsLoaded ? '1px solid red' : '1px solid #333',
              cursor: nombre.trim() && assetsLoaded ? 'pointer' : 'not-allowed',
              textShadow: nombre.trim() && assetsLoaded ? '0 0 10px red' : 'none',
              boxShadow: nombre.trim() && assetsLoaded ? '0 0 20px rgba(255,0,0,0.3)' : 'none'
            }}
            disabled={!assetsLoaded}
          >
            {assetsLoaded ? (nombre.trim() ? 'ENTRAR AL BUCLE' : 'ESPERANDO TU ALMA') : 'CARGANDO PESADILLAS...'}
          </button>
        </form>
      </div>
    </div>
  );
}
