import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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

const RutasConError = () => {
  const location = useLocation();
  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<CargaPantalla />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/juego/:nivel" element={<GamePage />} />
          <Route path="/puntajes" element={<Leaderboard />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <RutasConError />
    </BrowserRouter>
  );
};
