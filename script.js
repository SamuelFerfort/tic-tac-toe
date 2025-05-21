let moveCounter = 0;

let playerOneName = document.getElementById("player1").value || "Player 1";
let playerTwoName = document.getElementById("player2").value || "Player 2";
function Gameboard() {

    const rows = 3;
    const columns = 3;
    const board = [];
    
    
    const createBoard = () => {
        
        moveCounter = 0;
        console.log("trigger?");
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
            return true   
        }
        return false
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
    let moveHistory = []; // Initialize moveHistory

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    
    const getActivePlayer = () => activePlayer;

    const getMoveHistory = () => moveHistory; // Add getMoveHistory function

    // check for draw 

    

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
    
    const playRound = (cell, row, col) => { // Add row and col parameters
        // Assuming I have the cell dataset 

        board.dropMark(cell, getActivePlayer().mark)
        moveCounter++;

        // Record move
        const move = {
            playerName: getActivePlayer().name,
            mark: getActivePlayer().mark,
            row: parseInt(row), // Ensure row and col are numbers
            col: parseInt(col)
        };
        moveHistory.push(move);
        
        isWin = checkForWin()
        
        console.log(moveCounter)
        console.log(isWin);
        if (isWin) {
            return "win";
        }
        if (moveCounter === 9) {
            return "draw";
        }
        

        switchPlayerTurn();
        
         
    }
    
    // Modify createBoard to clear moveHistory
    const originalCreateBoard = board.createBoard;
    const createBoardWithHistoryClear = () => {
        originalCreateBoard();
        moveHistory = []; // Clear move history
    }

    return {playRound, getActivePlayer, getBoard: board.getBoard, dropMark: board.dropMark, createBoard: createBoardWithHistoryClear, switchPlayerTurn, getMoveHistory}; // Add getMoveHistory to returned object
}

function ScreenController() {
    

    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const dialog = document.querySelector("dialog");
    const winner = document.querySelector(".winner");
    const moveHistoryContainer = document.getElementById("move-history-container"); // Get reference to move history container
    
    
    const updateScreen = () => {
        boardDiv.textContent = "";
        const cellButtons = document.querySelectorAll(".cell");
        cellButtons.forEach(button => {
            button.removeEventListener("click", clickHandlerBoard);
        });
    
        const activePlayer = game.getActivePlayer();
        const board = game.getBoard();
        let playerOneName = document.getElementById("player1").value || "Player 1";
        let playerTwoName = document.getElementById("player2").value || "Player 2";
        
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
        });

        // Update move history display
        if (moveHistoryContainer) { // Check if the container exists
            moveHistoryContainer.innerHTML = ""; // Clear previous history
            const moves = game.getMoveHistory();
            if (moves && moves.length > 0) {
                const historyTitle = document.createElement("h3");
                historyTitle.textContent = "Move History:";
                moveHistoryContainer.appendChild(historyTitle);

                const ul = document.createElement("ul");
                moves.forEach(move => {
                    const li = document.createElement("li");
                    // Adjust row and col by +1 for display as they are 0-indexed
                    li.textContent = `${move.playerName} (${move.mark}) played at Row ${move.row + 1}, Col ${move.col + 1}`;
                    ul.appendChild(li);
                });
                moveHistoryContainer.appendChild(ul);
            }
        }
    }
        
        const reset = document.querySelectorAll(".reset");
            
            reset.forEach(button => {
                button.addEventListener("click", () => {
                game.createBoard();
                dialog.close();
                const activePlayer = game.getActivePlayer();
                if (activePlayer.mark == "O") {
                    
                    game.switchPlayerTurn();
                }   
                updateScreen()
                
            })});
        

        boardDiv.addEventListener("click", clickHandlerBoard);

        function clickHandlerBoard(e) {
            const selectedCellId = e.target.dataset.cell;    
            
            let row, col;
            if (selectedCellId.includes('-')) { // Row-column format
            [row, col] = selectedCellId.split('-');
            } 

            const actualCell = game.getBoard()[row][col];
            const activePlayer = game.getActivePlayer(); 
            isAlreadyMarked = game.dropMark(actualCell, activePlayer.mark);
            if (isAlreadyMarked) {
                // Pass row and col to playRound
                displayWinner = game.playRound(actualCell, row, col); 
            }
            
            
            if (displayWinner == "win") {
                dialog.showModal();
                
                winner.textContent = `${activePlayer.name} Wins The Game!`
            }else if (displayWinner == "draw") {
                dialog.showModal();
                winner.textContent = `Draw!`
            }
            updateScreen();
            
        }   
       
            
        //Initial render
        updateScreen();
       
}

ScreenController();