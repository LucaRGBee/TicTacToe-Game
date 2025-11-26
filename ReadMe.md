# TicTacToe Game

---

## Prerequisites

You need:
- Node.js V 22+
- pnpm
- Optional: Docker

### How to install Node + pnpm

Visit the [NodeJS Website](https://nodejs.org/en) and follow installation Steps

```sh
npm install -g pnpm
```

### How to install Docker + Docker-Compose

Visit the [Docker Website](https://www.docker.com/get-started) and follow installation Steps

---

## Setup/Startup
```sh
git clone -b feat/typescript-migration https://github.com/LucaSamuelRoszak/TicTacToe-Game.git
cd TicTacToe-Game/

docker compose up --build
```
Now you can visit [localhost](http://localhost) to play the game or use the api at <http://localhost:8080>

---

## API Endpoints

### /check-game/
Description:
Validates wheather a game has ended based on a given Board.

Body:
```json
# each n has to be -1 | 0 | 1
{
    "board":    [[n,n,n]
                ,[n,n,n]
                ,[n,n,n]],
    "turn": int
}
```
Response:
|Code|Meaning|
|:----:|:-------:|
|0   |Game still in progress|
|1|Game has ended in a Win|
|-1|Game has ended in a Draw|

---

### /cpu-move/
Description:
Takes in a board and returns a computer generated move.

Body:
```json
# each n has to be -1 | 0 | 1
{
    "board":    [[n,n,n]
                ,[n,n,n]
                ,[n,n,n]]
}
```

Response:
```sh
# x and y are the coordinates the computer has choosen
{
    "move": [x,y]
}
```