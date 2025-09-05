import "./style.css";

let h2 = document.getElementById("turn");

let turn = 0;

let gameOver = false;

let board = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

async function clicked(b, x, y) {
  if (turn % 2 == 0) {
    h2.textContent = `Player ${2 - (turn % 2)}\'s Turn`;

    if (turn % 2 == 0) {
      b.style.background = "#00FF00";
      board[x][y] = 1;
    } else {
      b.style.background = "#FF0000";
      board[x][y] = -1;
    }

    b.disabled = true;
    await checkGame();

    if (!gameOver && turn % 2 == 1) {
      cpuTurn();
    }
  }
}

async function cpuTurn() {
  await fetch("http://localhost:8080/cpu-move", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ board: board }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("error");
      }
      return response.json();
    })
    .then((data) => {
      const num = 3 * data["move"][1] + data["move"][0] + 1;
      let buttons = document.querySelectorAll(".b");

      console.log(num);

      let counter = 1;

      buttons.forEach((button) => {
        if (counter == num) {
          button.style.background = "#FF0000";
          button.disabled = true;
          console.log(data["move"][0], data["move"][1]);
          board[data["move"][1]][data["move"][0]] = -1;
        }
        counter++;
      });
    })
    .catch((error) => {
      console.error(error);
    });
  console.log(board);

  await checkGame();
}

function gameEnd(a) {
  gameOver = true;
  let buttons = document.querySelectorAll(".b");

  buttons.forEach((button) => {
    button.disabled = true;
  });

  if (a) {
    h2.textContent = `It's a Tie`;
    return;
  }
  h2.textContent = `Player ${(turn % 2) + 1} Wins`;
}

async function checkGame() {
  await fetch("http://localhost:8080/check-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ board: board, turn: turn }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("error");
      }
      return response.json();
    })
    .then((data) => {
      if (!data["result"] == 0) {
        gameEnd(data["result"] == -1);
        turn--;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  turn++;
}

window.clicked = clicked;
window.cpuTurn = cpuTurn;
window.checkGame = checkGame;
