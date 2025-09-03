let h2 = document.getElementById("turn")

let turn = 0

let board = [[0,0,0],
             [0,0,0],
             [0,0,0]]

function clicked(b, x, y){

    h2.textContent = `Player ${2-turn%2}\'s Turn`

    if(turn % 2 == 0){
        b.style.background = "#00FF00"
        board[x][y] = 1
    }
    else{
        b.style.background = "#FF0000"
        board[x][y] = -1
    }    
    
    b.disabled = true
    checkGame()
    turn++
}

function checkGame(){
    for(let x = 0; x < 3; x++){
        if(Math.abs(board[x][0] + board[x][1] + board[x][2]) == 3 || Math.abs(board[0][x] + board[1][x] + board[2][x]) == 3){
            gameEnd()
            return
        }
    }

    if(Math.abs(board[0][0] + board[1][1] + board[2][2]) == 3){
        gameEnd()
        return
    }

    if(Math.abs(board[2][0] + board[1][1] + board[0][2]) == 3){
        gameEnd()
        return
    }

    if(turn == 8){
        gameEnd(true)
    }
}

function gameEnd(a){
    let buttons = document.querySelectorAll(".b")

    buttons.forEach(button => {
        button.disabled = true
    })

    if(a){
        h2.textContent = `It's a Tie`
        return
    }
    h2.textContent = `Player ${turn%2+1} Wins`
}
