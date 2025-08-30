import { useState } from 'react';
import LoginPage from './LoginPage';
import Homepage from './Homepage';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // display login screen if not authenticated
  if (!token) {
    return <LoginPage setToken={setToken} />;
  }

  return <Homepage token={token} setToken={setToken} />;
}

export default App;
