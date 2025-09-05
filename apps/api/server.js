const express = require("express");
const cors = require("cors");
const { resolve } = require("path");
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

function checkPotential(a, board, response) {
  for (let x = 0; x <= 2; x++) {
    if (board[x][0] + board[x][1] + board[x][2] == a) {
      if (!response) {
        for (let y = 0; y <= 2; y++) {
          if (board[x][y] == 0) {
            response = { move: [y, x] };
          }
        }
      }
    }

    if (board[0][x] + board[1][x] + board[2][x] == a) {
      if (!response) {
        for (let y = 0; y <= 2; y++) {
          if (board[y][x] == 0) {
            response = { move: [x, y] };
          }
        }
      }
    }
  }

  if (board[0][0] + board[2][2] + board[1][1] == a && !response) {
    if (!response) {
      for (let x = 0; x <= 2; x++) {
        if (board[x][x] == 0) {
          response = { move: [x, x] };
        }
      }
    }
  }

  if (board[0][2] + board[2][0] + board[1][1] == a && !response) {
    if (!response) {
      for (let x = 0; x <= 2; x++) {
        if (board[x][2 - x] == 0) {
          response = { move: [2 - x, x] };
        }
      }
    }
  }

  return response;
}

app.post("/cpu-move", (req, res) => {
  const { board } = req.body;

  let response;

  response = checkPotential(-2, board, response);

  if (!response) {
    response = checkPotential(2, board, response);
  }

  if (!response) {
    let possible = [];
    for (let x = 0; x <= 2; x++) {
      for (let y = 0; y <= 2; y++) {
        if (board[x][y] == 0) {
          possible.push([y, x]);
        }
      }
    }
    response = { move: possible[Math.floor(Math.random() * possible.length)] };
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(response);
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

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(response);
});

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
