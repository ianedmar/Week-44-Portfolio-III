import { create2DArrayWithFill } from "../utils/array.mjs"

function createGameBoard(dim) {
    return {
        ships: create2DArrayWithFill(dim),
        target: create2DArrayWithFill(dim)
    };
}

export default createGameBoard;