import type { IBoard, IColumn } from "$lib/components/game/types";
import { gameState } from "../../../../state/state.svelte";

function makeSquareId (x: number, y: number, columns: number): number {
    return x + y * columns;
}

function initializeBoard() {
    const { rows, columns } = gameState;

    let board: IBoard = [];

    for (let x = 0; x < columns; x++) {
        let column: IColumn = [];

        for (let y = 0; y < rows; y++) {
            column[y] = { id: makeSquareId(x, y, columns), x, y, tile: null}
        }
        board[x] = column;
    }
    console.log("board", board)
    gameState.board = board;
}

export default initializeBoard;