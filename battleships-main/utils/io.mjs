import * as readline from "node:readline"
import { ANSI } from "./ansi.mjs";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

process.stdin.on("keypress", (str, key) => {

    if (key.name == KEY_ID.escape) {
        process.exit();
    }

    if (KEY_STATES.hasOwnProperty(key.name)) {
        KEY_STATES[key.name] = true;
    }
});

const KEY_ID =
{
    down: "down",
    up: "up",
    left: "left",
    right: "right",
    return: "return",
    escape: "escape",
    r: "r"
}

const KEY_STATES = Object.keys(KEY_ID).reduce((prev, cur) => {
    prev[cur] = false;
    return prev;
}, {});


function readKeyState(key) {
    let value = KEY_STATES[key];
    KEY_STATES[key] = false;
    return value;
}

const KeyBoardManager = {

    isEnterPressed: () => {
        return readKeyState(KEY_ID.return);
    },

    isDownPressed: () => {

        return readKeyState(KEY_ID.down);
    },
    isUpPressed: () => {
        return readKeyState(KEY_ID.up);
    },
    isLeftPressed: () => {
        return readKeyState(KEY_ID.left);
    },
    isRightPressed: () => {
        return readKeyState(KEY_ID.right);
    },
    isRotatePressed: () => {
        return readKeyState(KEY_ID.r);
    }

}


function calculateStringBounds(str) {

    str = str ?? "";

    const lines = str.split("\n");
    let minLineLength = str.length;
    let maxLineLength = 0;
    let height = lines.length;

    for (const line of lines) {
        const lenght = line.length
        if (lenght < minLineLength) {
            minLineLength = lenght;
        }
        if (lenght > maxLineLength) {
            maxLineLength = lenght;
        }
    }

    return { max: maxLineLength, min: minLineLength, height, width: maxLineLength }
}

function printLine(text) {
    process.stdout.write(`${text}\n\r`);
}

function print(...text) {
    process.stdout.write(`${text.join("")}`);
}

function printCenterd(text) {
    const textBounds = calculateStringBounds(text);
    const sr = Math.round((process.stdout.rows - textBounds.height) * 0.5);
    const sc = Math.round((process.stdout.columns - textBounds.width) * 0.5);
    printWithOffset(text, sr, sc)
}

function printWithOffset(text, row, col) {

    const lines = text.split("\n");
    let output = ANSI.moveCursorTo(row, 0);

    for (let line of lines) {
        output = `${output}${ANSI.CURSOR_RIGHT.repeat(col)}${line}\n`;
    }

    print(output);
}

function clearScreen() {
    print(ANSI.CLEAR_SCREEN, ANSI.DELETE_SCREEN, ANSI.CURSOR_HOME, ANSI.RESTORE_CURSOR);
}

export default KeyBoardManager;
export { print, printLine, printCenterd, clearScreen }