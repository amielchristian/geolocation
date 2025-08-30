import express from 'express';
import {
  initializeDB,
  addUser,
  updateHistory,
  getHistory,
  verifyUser,
} from './db.js';

const app = express();
app.use(express.json());
const port = 3000;

initializeDB();

app.get('/api/get-history', async (req, res) => {
  const history = await getHistory(req.headers.authorization);
  console.log(history);
  res.send(history);
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const credentials = await verifyUser(email, password);
  console.log(credentials);
  if (credentials.token) res.json(credentials);
  else res.status(401).json({ error: 'Invalid credentials.' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
