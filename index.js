let h2 = document.getElementById("turn");

let turn = 0;

let board = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

async function clicked(b, x, y) {
  h2.textContent = `Player ${2 - (turn % 2)}\'s Turn`;

  if (turn % 2 == 0) {
    b.style.background = "#00FF00";
    board[x][y] = 1;
  } else {
    b.style.background = "#FF0000";
    board[x][y] = -1;
  }

  b.disabled = true;

  checkGame();
}

function gameEnd(a) {
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
      }
    })
    .catch((error) => {
      console.error(error);
    });
  turn++;
}
