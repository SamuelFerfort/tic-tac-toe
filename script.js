// 


function Gameboard() {

    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++){
            board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());

        }
    }
    const getBoard = () => board;

    // Populate cell with mark and check if it already has mark
    const dropMark = (cell, player) => {
        if (cell.getValue() == "?") { 
            cell.addMark(player);
            console.log("Cell marked!");
            return true;
        }
         return false;
    }
    
    return { getBoard, dropMark}
}

function Cell() {
    let value = "?";

    const addMark = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addMark, getValue };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {

    const board = Gameboard();

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
    }
    
    const getActivePlayer = () => activePlayer;

    const playRound = (cell) => {
        // Assuming I have the cell dataset 

        board.dropMark(cell, getActivePlayer().mark)

       
        switchPlayerTurn();
        
    }
    

    return {playRound, getActivePlayer, getBoard: board.getBoard, dropMark: board.dropMark};
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

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
            let row, col;
            if (selectedCellId.includes('-')) { // Row-column format
            [row, col] = selectedCellId.split('-');
            } 

            const actualCell = game.getBoard()[row][col];
            const marked = game.dropMark(actualCell, game.getActivePlayer().mark);
            console.log(marked);
            if (marked) { // Check if dropMark returned (meaning cell was marked)
                game.playRound(actualCell);
                updateScreen();
            }
        }   
        boardDiv.addEventListener("click", clickHandlerBoard);

        //Initial render
        updateScreen();
}

ScreenController();