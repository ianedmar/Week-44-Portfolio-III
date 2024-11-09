import { ANSI } from "./utils/ansi.mjs";
import { print, clearScreen } from "./utils/io.mjs";
import SplashScreen from "./game/splash.mjs";
import { FIRST_PLAYER, SECOND_PLAYER } from "./consts.mjs";
import createMenu from "./utils/menu.mjs";
import createMapLayoutScreen from "./game/mapLayoutScreen.mjs";
import createBattleshipScreen from "./game/battleshipsScreen.mjs";

const GAME_FPS = 1000 / 60;
let currentState = null;
let gameLoop = null;

function checkResolution() {
    const MIN_WIDTH = 80;
    const MIN_HEIGHT = 24;
    const { columns, rows } = process.stdout;
    if (columns < MIN_WIDTH || rows < MIN_HEIGHT) {
        clearScreen();
        print(`\nConsole size is too small. Please resize to at least ${MIN_WIDTH}x${MIN_HEIGHT}.\n`);
        process.exit();
    }
}

(function initialize() {
    checkResolution();
    print(ANSI.HIDE_CURSOR);
    clearScreen();
    const mainMenuScene = createMenu(buildMenu());
    SplashScreen.next = mainMenuScene;
    currentState = SplashScreen;
    gameLoop = setInterval(update, GAME_FPS);
})();

function update() {
    currentState.update(GAME_FPS);
    currentState.draw(GAME_FPS);

    if (currentState.transitionTo) {
        currentState = currentState.next;
        clearScreen();
        print(ANSI.CURSOR_HOME);
        currentState.transitionTo = null;
    }
}

function buildMenu() {
    return [
        { 
            text: "Start Game", 
            action: startGame 
        },
        { 
            text: "Exit Game", 
            action: exitGame 
        }
    ];
}

function startGame() {
    let p1map = createMapLayoutScreen();
    p1map.init(FIRST_PLAYER, (player1ShipMap) => {
        let p2map = createMapLayoutScreen();
        p2map.init(SECOND_PLAYER, (player2ShipMap) => {
            return createBattleshipScreen(player1ShipMap, player2ShipMap);
        });
        return p2map;
    });
    currentState.next = p1map;
    currentState.transitionTo = "Map layout";
}

function exitGame() {
    print("Are you sure you want to exit? (y/n)");
    process.stdin.once('data', (input) => {
        if (input.toString().trim().toLowerCase() === 'y') {
            process.exit();
        } else {
            currentState.transitionTo = "Menu";
        }
    });
}

function getInputCoordinates() {
    return new Promise((resolve) => {
        process.stdin.once('data', (input) => {
            const coord = input.toString().trim().split(",");
            const row = parseInt(coord[0], 10);
            const col = parseInt(coord[1], 10);
            if (isNaN(row) || isNaN(col) || row < 0 || col < 0) {
                print("Invalid coordinates. Please enter valid coordinates (e.g., 3,4).");
                return getInputCoordinates().then(resolve);
            }
            resolve({ row, col });
        });
    });
}

function switchToNextState(newState) {
    clearScreen();
    print(ANSI.CURSOR_HOME);
    currentState = newState;
    currentState.transitionTo = null;
}

function createBattleshipScreen(player1ShipMap, player2ShipMap) {
    let currentPlayer = FIRST_PLAYER;
    let firstPlayerBoard = player1ShipMap;
    let secondPlayerBoard = player2ShipMap;
    let currentBoard = firstPlayerBoard;
    let opponentBoard = secondPlayerBoard;

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

    function drawBoard(board) {
        let output = "";
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                if (board[row][col] === 0) output += " ";
                else if (board[row][col] === "SHIP") output += "S";  
                else if (board[row][col] === "HIT") output += "X";   
                else if (board[row][col] === "MISS") output += "O";  
            }
            output += "\n";
        }
        return output;
    }

    async function attackOpponent() {
        print(`Player ${currentPlayer}, it's your turn. Enter coordinates (row,col):`);
        const coord = await getInputCoordinates();
        const { row, col } = coord;
        const cell = opponentBoard[row][col];

        if (cell === "SHIP") {
            opponentBoard[row][col] = "HIT";  
            print(`Player ${currentPlayer} hits a ship at (${row}, ${col})!`);
        } else if (cell === 0) {
            opponentBoard[row][col] = "MISS";  
            print(`Player ${currentPlayer} misses at (${row}, ${col}).`);
        }

        swapPlayer();
    }

    return {
        update: async function() {
            if (currentBoard) {
                print(drawBoard(currentBoard));
                await attackOpponent();
            }
        },
        draw: function() {
            print(drawBoard(currentBoard));
        },
        isOver: function() {
        }
    };
}
