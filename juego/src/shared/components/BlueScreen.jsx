import { useEffect, useState } from 'react';

export const BlueScreen = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Al montarse, simula congelar el navegador por un instante
    document.body.style.cursor = 'none';
    // Intento de forzar pantalla completa para asustar más
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {
      // Ignorar si falla por permisos
    }

    const fakeLogs = [
      "Borrando C:\\Windows\\System32...",
      "Borrando C:\\Users\\Documentos...",
      "Eliminando registro de sistema...",
      "Activando micrófono remotamente...",
      "Subiendo datos a servidor oculto...",
      "LA CORRUPCIÓN ES TOTAL.",
      "NO DEBISTE MIRAR ATRÁS."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < fakeLogs.length) {
        setLogs(prev => [...prev, fakeLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => {
      clearInterval(interval);
      document.body.style.cursor = 'crosshair'; // Restaurar el cursor original
    };
  }, []);

  return (
    <div style={{
      backgroundColor: '#0000AA',
      color: '#FFFFFF',
      height: '100vh',
      width: '100vw',
      padding: '50px',
      fontFamily: "'Lucida Console', Monaco, monospace",
      fontSize: '1.2rem',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ backgroundColor: 'white', color: '#0000AA', display: 'inline-block', padding: '2px 10px', marginTop: 0 }}>Windows</h1>
      <br/><br/>
      <p>A fatal exception 0E has occurred at 028:C0011E36 in VXD VMM(01) + 00010E36.</p>
      <p>The current application will be terminated.</p>
      <br/>
      <p>* Press any key to terminate the current application.</p>
      <p>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
      <br/>
      <p style={{ textAlign: 'center' }}>Press any key to continue _</p>

      <div style={{ marginTop: '50px', color: '#ffaaaa', fontSize: '1rem' }}>
        {logs.map((log, index) => (
          <p key={index} style={{ margin: '5px 0' }}>{'>'} {log}</p>
        ))}
      </div>
    </div>
  );
};
