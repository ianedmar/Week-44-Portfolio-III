import { GAME_BOARD_DIM } from "../consts.mjs";
import { ANSI } from "../utils/ansi.mjs";
import { print, clearScreen } from "../utils/io.mjs";
import units from "./units.mjs";
import KeyBoardManager from "../utils/io.mjs";
import { create2DArrayWithFill } from "../utils/array.mjs";

function createMapLayoutScreen() {
    const MapLayout = {
        player: null,
        isDrawn: false,
        next: null,
        transitionTo: null,
        cursorColumn: 0,
        cursorRow: 0,
        currentShipIndex: 0,
        isHorizontal: false,
        map: create2DArrayWithFill(GAME_BOARD_DIM),
        ships: [...Object.values(units)],
        placedShips: [],
        transitionFn: null,

        init: function (player, transitionFn) {
            this.player = player;
            this.transitionFn = transitionFn;
        },

        canPlaceShip: function () {
            const ship = this.ships[this.currentShipIndex];
            const size = ship.size;

            if (this.isHorizontal) {
                if (this.cursorColumn + size > GAME_BOARD_DIM) return false;
            } else {
                if (this.cursorRow + size > GAME_BOARD_DIM) return false;
            }

            for (let i = 0; i < size; i++) {
                const column = this.isHorizontal ? this.cursorColumn + i : this.cursorColumn;
                const row = this.isHorizontal ? this.cursorRow : this.cursorRow + i;
                if (this.map[row][column] !== 0) return false;
            }
            return true;
        },

        placeShip: function () {
            const ship = this.ships[this.currentShipIndex];
            for (let i = 0; i < ship.size; i++) {
                const column = this.isHorizontal ? this.cursorColumn + i : this.cursorColumn;
                const row = this.isHorizontal ? this.cursorRow : this.cursorRow + i;
                this.map[row][column] = ship.symbole;
            }
            this.placedShips.push({
                ...ship,
                x: this.cursorColumn,
                y: this.cursorRow,
                isHorizontal: this.isHorizontal
            });
        },

        update: function () {
            if (KeyBoardManager.isUpPressed()) this.cursorRow = Math.max(0, this.cursorRow - 1);
            if (KeyBoardManager.isDownPressed()) this.cursorRow = Math.min(GAME_BOARD_DIM - 1, this.cursorRow + 1);
            if (KeyBoardManager.isLeftPressed()) this.cursorColumn = Math.max(0, this.cursorColumn - 1);
            if (KeyBoardManager.isRightPressed()) this.cursorColumn = Math.min(GAME_BOARD_DIM - 1, this.cursorColumn + 1);
            if (KeyBoardManager.isRotatePressed()) this.isHorizontal = !this.isHorizontal;

            if (KeyBoardManager.isEnterPressed() && this.currentShipIndex < this.ships.length) {
                if (this.canPlaceShip()) {
                    this.placeShip();
                    this.currentShipIndex++;
                    this.cursorColumn = 0;
                    this.cursorRow = 0;
                    if (this.currentShipIndex >= this.ships.length) {
                        this.next = this.transitionFn();
                        this.transitionTo = "next state";
                    }
                }
            }
        },

        draw: function () {
            clearScreen();
            let output = `${ANSI.TEXT.BOLD}Ship Placement\n${ANSI.TEXT.BOLD_OFF}`;
            for (let y = 0; y < GAME_BOARD_DIM; y++) {
                for (let x = 0; x < GAME_BOARD_DIM; x++) {
                    const cell = this.map[y][x];
                    if (cell !== 0) output += '█';
                    else output += ' ';
                }
                output += '\n';
            }
            print(output);
        }
    };
    return MapLayout;
}

export default createMapLayoutScreen;
