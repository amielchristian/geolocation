import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const initialState = {
  token: null
};

export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  return (
    <AppContext.Provider
      value={{
        token,
        
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);