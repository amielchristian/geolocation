import { useState, useEffect } from 'react';

type HistoryEntry = {
  id: number;
  location: string;
  ipv4_address: string;
};

export default function Homepage({
  token,
  setToken,
}: {
  token: string;
  setToken: (token: string | null) => void;
}) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (token) {
      fetch('/api/get-history', {
        headers: { Authorization: `${token}` },
      })
        .then((res) => res.json())
        .then(setHistory);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setHistory([]);
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h2>History</h2>
      <ul>
        {history.map((entry) => (
          <li key={entry.id}>
            {entry.location} ({entry.ipv4_address})
          </li>
        ))}
      </ul>
    </div>
  );
}
