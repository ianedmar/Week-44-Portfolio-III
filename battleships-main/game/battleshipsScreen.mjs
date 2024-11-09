import { GAME_BOARD_DIM, FIRST_PLAYER, SECOND_PLAYER } from "../consts.mjs";
import { print, clearScreen, KeyBoardManager } from "../utils/io.mjs";

function placeShips(board) {
    const shipCount = 5;
    let placedShips = 0;
    while (placedShips < shipCount) {
        const row = Math.floor(Math.random() * GAME_BOARD_DIM);
        const col = Math.floor(Math.random() * GAME_BOARD_DIM);
        if (board[row][col] === 0) {
            board[row][col] = "SHIP";
            placedShips++;
        }
    }
}

function drawBoard(board, selectedRow, selectedCol) {
    let output = "";
    for (let row = 0; row < GAME_BOARD_DIM; row++) {
        for (let col = 0; col < GAME_BOARD_DIM; col++) {
            if (row === selectedRow && col === selectedCol) {
                output += "[";
            }

            if (board[row][col] === 0) output += " ";
            else if (board[row][col] === "SHIP") output += "S";  
            else if (board[row][col] === "HIT") output += "X";   
            else if (board[row][col] === "MISS") output += "O";  

            if (row === selectedRow && col === selectedCol) {
                output += "]";
            }
        }
        output += "\n";
    }
    return output;
}

function getInputCoordinates(selectedRow, selectedCol, currentBoard) {
    if (KeyBoardManager.isDownPressed()) {
        selectedRow = Math.min(selectedRow + 1, GAME_BOARD_DIM - 1);
    }
    if (KeyBoardManager.isUpPressed()) {
        selectedRow = Math.max(selectedRow - 1, 0);
    }
    if (KeyBoardManager.isRightPressed()) {
        selectedCol = Math.min(selectedCol + 1, GAME_BOARD_DIM - 1);
    }
    if (KeyBoardManager.isLeftPressed()) {
        selectedCol = Math.max(selectedCol - 1, 0);
    }

    if (KeyBoardManager.isEnterPressed()) {
        if (currentBoard[selectedRow][selectedCol] === "HIT" || currentBoard[selectedRow][selectedCol] === "MISS") {
            print("This cell has already been attacked. Choose another one.");
            return { row: -1, col: -1 };
        } else {
            return { row: selectedRow, col: selectedCol };
        }
    }

    return { selectedRow, selectedCol };
}

const createBattleshipScreen = () => {
    let currentPlayer = FIRST_PLAYER;
    let firstPlayerBoard = Array(GAME_BOARD_DIM).fill(0).map(() => Array(GAME_BOARD_DIM).fill(0));
    let secondPlayerBoard = Array(GAME_BOARD_DIM).fill(0).map(() => Array(GAME_BOARD_DIM).fill(0));
    let currentBoard = null;
    let opponentBoard = null;
    let selectedRow = 0;
    let selectedCol = 0;

    placeShips(firstPlayerBoard);
    placeShips(secondPlayerBoard);

    function swapPlayer() {
        currentPlayer = currentPlayer === FIRST_PLAYER ? SECOND_PLAYER : FIRST_PLAYER;
        if (currentPlayer === FIRST_PLAYER) {
            currentBoard = firstPlayerBoard;
            opponentBoard = secondPlayerBoard;
        } else {
            currentBoard = secondPlayerBoard;
            opponentBoard = firstPlayerBoard;
        }
    }

    function attackOpponent(coord) {
        const { row, col } = coord;
        const cell = opponentBoard[row][col];

        if (cell === "SHIP") {
            opponentBoard[row][col] = "HIT";  
            print(`Player ${currentPlayer} hits a ship at (${row}, ${col})!`);
        } else if (cell === 0) {
            opponentBoard[row][col] = "MISS";  
            print(`Player ${currentPlayer} missed at (${row}, ${col}).`);
        }
    }

    function checkForWinner() {
        const opponentShips = opponentBoard.flat().filter(cell => cell === "SHIP").length;
        return opponentShips === 0;
    }

    function drawScreen() {
        clearScreen();
        print(`Player ${currentPlayer}'s Turn`);
        print("Your board:");
        print(drawBoard(currentBoard, selectedRow, selectedCol));
        print("\nOpponent's board:");
        print(drawBoard(opponentBoard, -1, -1));
    }

    function gameLoop() {
        drawScreen();

        const attackCoords = getInputCoordinates(selectedRow, selectedCol, currentBoard);
        if (attackCoords.row !== -1 && attackCoords.col !== -1) {
            selectedRow = attackCoords.row;
            selectedCol = attackCoords.col;

            attackOpponent(attackCoords);

            if (checkForWinner()) {
                print(`Player ${currentPlayer} wins!`);
                return;
            }

            swapPlayer();
        }

        gameLoop();
    }

    return {
        startGame: function () {
            gameLoop();
        }
    };
};

export default createBattleshipScreen;
