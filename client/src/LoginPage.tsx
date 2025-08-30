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
      <div
        id='login-panel'
        className='flex flex-col align-center justify-between p-[5%] w-[33%] mt-10 mx-auto h-110'
      >
        <div className='flex flex-col gap-4'>
          <span className='text-4xl font-bold underline m-4 text-center'>
            IP Geolocation
          </span>
          <input
            className='border-2 rounded-md p-3 w-full'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
          />
          <input
            className='border-2 rounded-md p-3 w-full'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            placeholder='Password'
          />
        </div>
        <button
          className='border-3 p-4 rounded-lg font-bold w-[50%] mx-auto hover:bg-gray-300 bg-gray-200'
          type='submit'
        >
          Login
        </button>

        {/* registration goes here if ever*/}
      </div>
    </form>
  );
}
