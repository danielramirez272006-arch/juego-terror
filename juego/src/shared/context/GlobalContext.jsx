/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [nombreJugador, setNombreJugador] = useState('');
  const [playerImage, setPlayerImage] = useState(null);

  return (
    <GlobalContext.Provider value={{ nombreJugador, setNombreJugador, playerImage, setPlayerImage }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
