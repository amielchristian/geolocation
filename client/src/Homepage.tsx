import { useState, useEffect } from 'react';
import Map from './Map.tsx';

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
  const [ip, setIp] = useState<string>('');
  const [textboxIp, setTextboxIp] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setHistory([]);
  };

  const getIpData = (ip: string | undefined) => {
    if (ip === '') {
      fetch(`/api/get-location`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setIp(data.ip);
          setLocation(
            `${data.location.location.city}, ${data.location.location.country}`
          );
          setLatitude(data.location.location.lat);
          setLongitude(data.location.location.lng);
        });
    } else {
      fetch(`/api/get-location?address=${ip}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.location.code) {
            setError(`${data.location.code}: ${data.location.messages}`);
            setIp('');
            setLocation('');
            setLatitude(null);
            setLongitude(null);
          } else if (data.location.location.country === 'ZZ') {
            setError(`No data found for IP address ${ip}`);
            setIp('');
            setLocation('');
            setLatitude(null);
            setLongitude(null);
          } else {
            setError(null);
            setIp(data.ip);
            setLocation(
              `${data.location.location.city}, ${data.location.location.country}`
            );
            setLatitude(data.location.location.lat);
            setLongitude(data.location.location.lng);
          }
        });
    }
  };

  // get history on load
  // get default ip data as well
  useEffect(() => {
    if (token) {
      getIpData(ip);

      fetch('/api/get-history', {
        headers: { Authorization: `${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setHistory(data);
        });
    }
  }, [token, ip]);

  // update history when IP data changes as well
  useEffect(() => {
    if (location === '') return;

    const updateHistory = async () => {
      await fetch('/api/get-history', {
        headers: { Authorization: `${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setHistory(data);
        });

      await fetch(`/api/update-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: token,
          city: location,
          address: ip,
        }),
      }).then((res) => res.json());
    };
    updateHistory();
  }, [token, location, ip]);

  return (
    <main className='flex flex-col w-[60%] mt-10 mx-auto'>
      <span className='text-4xl font-bold underline m-4 text-center'>
        IP Geolocation
      </span>
      <div className='border-2 rounded-lg mx-auto'>
        <div
          id='main-panel'
          className='flex flex-row justify-center divide-x-2 divide-black'
        >
          <div id='info' className='text-xl p-4'>
            {error && (
              <h2 className='font-bold' style={{ color: 'red' }}>
                {error}
              </h2>
            )}
            {!error && (
              <>
                <div>
                  <h2 className='font-bold'>IP:</h2> {ip}
                </div>
                <div>
                  <h2 className='font-bold'>Location: </h2>
                  {location}
                </div>
              </>
            )}
            {latitude && longitude && (
              <Map latitude={latitude} longitude={longitude} />
            )}
            <div id='search' className='my-2 flex justify-between gap-2'>
              <input
                className='px-2 w-[67%] border-1 rounded-sm'
                type='text'
                onChange={(e) => setTextboxIp(e.target.value)}
              />
              <button
                className='w-[33%] border-2 border-black hover:bg-gray-300 bg-gray-200 p-2 rounded-lg'
                onClick={() => {
                  getIpData(textboxIp);
                }}
              >
                Find
              </button>
            </div>
          </div>
          <div id='history' className='p-4'>
            <h2 className='font-bold text-xl text-center mb-2'>History</h2>
            <table>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id}>
                    <div className='flex flex-col'>
                      <div className='flex flex-row gap-4'>
                        <input
                          type='checkbox'
                          // onChange={(e) => {
                          //   // Define your onCheck function here or pass as prop
                          //   // Example:
                          //   // onCheck(entry, e.target.checked)
                          // }}
                        />
                        <span>{`${entry.location}`}</span>
                      </div>
                      <span className='italic'>{`${entry.ipv4_address}`}</span>
                    </div>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button
        className='border-3 p-4 rounded-lg font-bold w-[50%] hover:bg-gray-300 bg-gray-200'
        id='logout'
        onClick={handleLogout}
      >
        Logout
      </button>
    </main>
  );
}
