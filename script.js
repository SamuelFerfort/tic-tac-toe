// 

let playerOneName = document.getElementById("player1").value || "Player One";
let playerTwoName = document.getElementById("player2").value || "Player Two";
function Gameboard() {

    const rows = 3;
    const columns = 3;
    const board = [];
    
    const createBoard = () => {
        for (let i = 0; i < rows; i++){
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());

            }
        }
    }
    createBoard();
    const getBoard = () => board;

    // Populate cell with mark and check if it already has mark
    const dropMark = (cell, player) => {
        if (cell.getValue() == "") { 
            cell.addMark(player);   
        }
    }
    
    return { getBoard, dropMark, createBoard}
}

function Cell() {
    let value = "";

    const addMark = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addMark, getValue };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {

    const board = Gameboard();
    const boardCells = board.getBoard();
    const players = [
        {
            name: playerOneName,
            mark: "X"
        },
        {
            name: playerTwoName,
            mark: "O"
        }
    ];
    
    let activePlayer = players[0];
    
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        
        if (activePlayer === players[0]) {
            document.body.classList.remove('player2-turn');
            document.body.classList.add('player1-turn');
        } else {
            document.body.classList.remove('player1-turn');
            document.body.classList.add('player2-turn');
        }
    }
    
    const getActivePlayer = () => activePlayer;

    // check for draw 

    const checkForDraw = () => {


        for (let i = 0; i < boardCells.length; i++) {
            for (let j = 0; j < boardCells[i].length; j++) {
                // If any cell is empty, return false (game is not a draw)
                if (boardCells[i][j].getValue() == "") {
                    return false;
                }
            }
        }
        // If all cells are filled and no winner is detected, return true (game is a draw)
        return true;
    };

    const checkForWin = () => {
        
        
        for (let i = 0; i < 3; i++) {
            
            // Horizontal win check
            const horizontalWin = (boardCells[i][0].getValue() === "X" && boardCells[i][1].getValue() === "X" && boardCells[i][2].getValue() === "X") ||
                                  (boardCells[i][0].getValue() === "O" && boardCells[i][1].getValue() === "O" && boardCells[i][2].getValue() === "O");
            // Vertical win check
            const verticalWin = (boardCells[0][i].getValue() === "X" && boardCells[1][i].getValue() === "X" && boardCells[2][i].getValue() === "X") ||
                                (boardCells[0][i].getValue() === "O" && boardCells[1][i].getValue() === "O" && boardCells[2][i].getValue() === "O");
                                
            if (horizontalWin || verticalWin) {
                console.log("Win detected!");
                return true;
            }      
        
            }
        // Check for diagonal win
        const diagonalWin1 = (boardCells[0][0].getValue() === "X" && boardCells[1][1].getValue() === "X" && boardCells[2][2].getValue() === "X") ||
        (boardCells[0][0].getValue() === "O" && boardCells[1][1].getValue() === "O" && boardCells[2][2].getValue() === "O");
        const diagonalWin2 = (boardCells[0][2].getValue() === "X" && boardCells[1][1].getValue() === "X" && boardCells[2][0].getValue() === "X") ||
        (boardCells[0][2].getValue() === "O" && boardCells[1][1].getValue() === "O" && boardCells[2][0].getValue() === "O");
        if (diagonalWin1 || diagonalWin2) {
            console.log("Win detected!");
            return true;
        }

        return false; // Game continues
    }

    const playRound = (cell) => {
        // Assuming I have the cell dataset 

        board.dropMark(cell, getActivePlayer().mark)
       
        isWin = checkForWin()
        isDraw = checkForDraw();
        console.log(isDraw);
        console.log(isWin);
        if (isWin) {
            return "win";
        }
        if (isDraw) {
            return "draw";
        }
        

        switchPlayerTurn();
        
        console.log("hello?")  
    }
    

    return {playRound, getActivePlayer, getBoard: board.getBoard, dropMark: board.dropMark, createBoard: board.createBoard};
}

function ScreenController() {
    

    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const dialog = document.querySelector("dialog");
    const winner = document.querySelector(".winner")
    
    
    const updateScreen = () => {
        boardDiv.textContent = "";
        const activePlayer = game.getActivePlayer();
        const board = game.getBoard();
        let playerOneName = document.getElementById("player1").value || "Player One";
        let playerTwoName = document.getElementById("player2").value || "Player Two";
        
        if (activePlayer.mark == "X") {
            activePlayer.name = playerOneName;
        } else {
            activePlayer.name = playerTwoName;
        }
        console.log(activePlayer.name);
        console.log(playerOneName);
        playerTurnDiv.textContent = `${activePlayer.name}'s turn` 

        //Render cells
        
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellBtn = document.createElement("button");
                cellBtn.classList.add("cell");
                cellBtn.dataset.cell =  `${rowIndex}-${colIndex}`;
                cellBtn.textContent = cell.getValue();
                boardDiv.appendChild(cellBtn);
                
                
            })
        })
        }


        function clickHandlerBoard(e) {
            const selectedCellId = e.target.dataset.cell;    
            const reset = document.querySelector(".reset");
            
            reset.addEventListener("click", () => {
                game.createBoard();
                updateScreen();
                dialog.close();
            })
            let row, col;
            if (selectedCellId.includes('-')) { // Row-column format
            [row, col] = selectedCellId.split('-');
            } 

            const actualCell = game.getBoard()[row][col];
            
            displayWinner = game.playRound(actualCell);
            
            if (displayWinner == "win") {
                dialog.showModal();
                const activePlayer = game.getActivePlayer(); 
                winner.textContent = `${activePlayer.name} WINS THE ROUND`
            }
            updateScreen();
            
        }   
        boardDiv.addEventListener("click", clickHandlerBoard);
            
        //Initial render
        updateScreen();
       
}

ScreenController();