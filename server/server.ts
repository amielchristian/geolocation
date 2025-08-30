import express from 'express';

const app = express();
const port = 3000;

app.get('/api', (req, res) => {
  res.send({message: 'safdsHello, world!'});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});