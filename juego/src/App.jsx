import { AppRouter } from './shared/routing/app-router';
import { GlobalProvider } from './shared/context/GlobalContext';

function App() {
  return (
    <GlobalProvider>
      <AppRouter />
    </GlobalProvider>
  )
}

export default App;
