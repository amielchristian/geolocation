import { useState, useEffect } from 'react';

type HistoryEntry = {
  id: number;
  location: string;
  ipv4_address: string;
};
type LocationData = {
  ip: string;
  location: {
    ip: string;
    location: {
      country: string;
      region: string;
      city: string;
      lat: number;
      lng: number;
      postalCode: string;
      timezone: string;
      geonameId: number;
    };
    as: {
      asn: number;
      name: string;
      route: string;
      domain: string;
      type: string;
    };
    isp: string;
  };
};

export default function Homepage({
  token,
  setToken,
}: {
  token: string;
  setToken: (token: string | null) => void;
}) {
  const [ipData, setIpData] = useState<LocationData | undefined>();
  const [currentIpv4, setCurrentIpv4] = useState<string | undefined>();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // get history on load
  useEffect(() => {
    if (token) {
      fetch('/api/get-history', {
        headers: { Authorization: `${token}` },
      })
        .then((res) => res.json())
        .then(setHistory);
    }
  }, [token]);

  // get location of user on load
  useEffect(() => {
    fetch(`/api/get-location`)
      .then((res) => res.json())
      .then((data) => setIpData(data));
  }, []);

  const getIpData = (ip: string | undefined) => {
    if (ip === '') {
      fetch(`/api/get-location`)
        .then((res) => res.json())
        .then((data) => setIpData(data));
      return;
    }
    fetch(`/api/get-location?address=${ip}`)
      .then((res) => res.json())
      .then((data) => setIpData(data));

    fetch(`/api/update-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        city: ipData?.location?.location?.city,
        currentIpv4,
      }),
    });

    if (token) {
      fetch('/api/get-history', {
        headers: { Authorization: `${token}` },
      })
        .then((res) => res.json())
        .then(setHistory);
    }
  };

  // for logging out
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setHistory([]);
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <div>
        {ipData && (
          <>
            <h1>Your IP: {ipData.ip}</h1>
            {ipData.location && (
              <h3>
                {ipData.location.location.city},
                {ipData.location.location.region},
                {ipData.location.location.country}
              </h3>
            )}
          </>
        )}
      </div>
      <input
        value={currentIpv4}
        onChange={(e) => setCurrentIpv4(e.target.value)}
        type='text'
      />
      <button
        onClick={() => {
          getIpData(currentIpv4);
        }}
      >
        Submit
      </button>
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
