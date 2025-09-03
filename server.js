const express = require("express");
const app = express();
const PORT = 8080;

const allowedOrigins = ['http://127.0.0.1:5500'];

app.use((req, res, next) => {

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {

    res.header('Access-Control-Allow-Origin', origin);

  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {

    return res.status(200).end();

  }

  next();

});

app.use(express.json());

app.post("/cpu-move", (req, res) => {
  const { board } = req.body;

  if (!board) {
    res.status(418).send({ message: "no board provided" });
  }

  res.status(200).send({
    board: "test",
  });
});

app.post("/check-game", (req, res) => {
  console.log(req)
  const { board } = req.body;

  if (!board) {
    res.status(418).send({ message: "no board provided" });
  }

  console.log(board[0]);
  res.setHeader("Content-Type", "application/json")
  res.status(200).json({
    board: "test",
  });
});

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
