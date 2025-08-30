import { useState } from 'react';

export default function LoginPage({
  setToken,
}: {
  setToken: (token: string) => void;
}) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log(data);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Email'
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type='password'
        placeholder='Password'
      />
      <button type='submit'>Login</button>
      {/* registration goes here if ever*/}
    </form>
  );
}
