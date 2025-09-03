const express = require("express");
const app = express();
const PORT = 8080;

const allowedOrigins = ["http://127.0.0.1:5500"];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

app.post("/cpu-move", (req, res) => {
  res.status(200).send({
    board: "test",
  });
});

app.post("/check-game", (req, res) => {
  const { board } = req.body;
  const { turn } = req.body;

  var response;
  var done = false;

  if (!board) {
    res.status(418).send({ message: "no board provided" });
  }

  for (let x = 0; x < 3; x++) {
    if (
      Math.abs(board[x][0] + board[x][1] + board[x][2]) == 3 ||
      Math.abs(board[0][x] + board[1][x] + board[2][x]) == 3
    ) {
      response = { result: 1 };
      done = true;
    }
  }

  if (!done && Math.abs(board[0][0] + board[1][1] + board[2][2]) == 3) {
    response = { result: 1 };
    done = true;
  }

  if (!done && Math.abs(board[2][0] + board[1][1] + board[0][2]) == 3) {
    response = { result: 1 };
    done = true;
  }

  if (!done && turn == 8) {
    response = { result: -1 };
  }

  if (!response) {
    response = { result: 0 };
  }

  console.log(response);

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(response);
});

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
