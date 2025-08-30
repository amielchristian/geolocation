import express from 'express';
import { initializeDB, updateHistory, getHistory, verifyUser } from './db.js';
import dotenv from 'dotenv';
import { publicIpv4 } from 'public-ip';

const app = express();
app.use(express.json());
const port = 3000;

dotenv.config();
const IPIFY_TOKEN = process.env.IPIFY_TOKEN;

initializeDB();

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const credentials = await verifyUser(email, password);
  if (credentials.token) res.json(credentials);
  else res.status(401).json({ error: 'Invalid credentials.' });
});

app.get('/api/get-location', async (req, res) => {
  let ip = req.query.address ?? req.ip;

  if (ip === '::1' || ip === '127.0.0.1') {
    ip = await publicIpv4();
  }

  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${IPIFY_TOKEN}&ipAddress=${ip}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json({ ip, location: data });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

app.post('/api/update-history', async (req, res) => {
  const { id, location, address } = await updateHistory();
  const history = await updateHistory(id, location, address);
  res.send(history);
});

app.get('/api/get-history', async (req, res) => {
  const history = await getHistory(req.headers.authorization);
  res.send(history);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
