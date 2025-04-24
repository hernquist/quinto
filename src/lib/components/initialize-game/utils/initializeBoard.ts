import type { IBoard, IColumn } from "$lib/components/game/types";
import { getGameState  } from "../../../state/game.svelte";


function makeSquareId (x: number, y: number, columns: number): number {
    return x + y * columns;
}

function initializeBoard() {
    const gameState = getGameState();
    const { rows, columns } = gameState.game;

    let board: IBoard = [];

    for (let x = 0; x < columns; x++) {
        let column: IColumn = [];

        for (let y = 0; y < rows; y++) {
            column[y] = { id: makeSquareId(x, y, columns), x, y, tile: null}
        }
        board[x] = column;
    }
    gameState.updateBoard(board);
}

export default initializeBoard;