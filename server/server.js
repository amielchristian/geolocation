import express from "express";
import {
  initializeDB,
  addUser,
  updateHistory,
  getHistory,
  verifyUser,
} from "./db.js";

const app = express();
app.use(express.json());
const port = 3000;

initializeDB();

app.get("/api", (req, res) => {
  const clientIp = req.socket.localAddress || req.ip;
  console.log(req.socket.localAddress);
  res.send({ message: clientIp });
});

app.get("/api/get-history", async (req, res) => {
  const history = await getHistory("amiel@yahoo.com");

  res.send(history);
});

app.post("/api/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const userId = await verifyUser(email, password);
  if (userId) res.json({ token: userId });
  else res.status(401).json({ error: "Invalid credentials." });
});

// app.get('/api', (req, res) => {
//   const clientIp = req.ip;
//   res.send({message: 'safdsHello, world!'});
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
