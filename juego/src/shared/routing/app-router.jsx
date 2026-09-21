import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { ErrorBoundary } from '../components/ErrorBoundary';

// Carga asíncrona de páginas para mejorar rendimiento
const Home = lazy(() => import('../../pages/Home'));
const GamePage = lazy(() => import('../../pages/game-page'));
const Leaderboard = lazy(() => import('../../pages/Leaderboard'));

// Componente visual de carga
const CargaPantalla = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000', color: '#fff', fontSize: '24px' }}>
    Cargando la pesadilla...
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* Navbar temporal para navegación en desarrollo */}
      <nav style={{ display: 'flex', gap: '2rem', padding: '1.5rem', background: '#0a0a0a', borderBottom: '1px solid #333' }}>
        <Link to="/" style={{ color: '#aaa', textDecoration: 'none' }}>Menú Principal</Link>
        <Link to="/juego/1" style={{ color: '#8b0000', textDecoration: 'none', fontWeight: 'bold' }}>Entrar al Pasillo</Link>
        <Link to="/puntajes" style={{ color: '#aaa', textDecoration: 'none' }}>Clasificación</Link>
      </nav>

      <ErrorBoundary>
        <Suspense fallback={<CargaPantalla />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/juego/:nivel" element={<GamePage />} />
            <Route path="/puntajes" element={<Leaderboard />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
