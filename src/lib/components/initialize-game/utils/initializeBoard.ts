import type { IBoard, IColumn } from "$lib/components/game/types";
import { GameState  } from "../../../state/game/game.svelte";


function makeSquareId (x: number, y: number, columns: number): number {
    return x + y * columns;
}

function initializeBoard(gameState: GameState) {
    
    const { rows, columns } = gameState.game;

    let board: IBoard = [];
    const initialSquare = {
        hovering: false, hasDropzone: false, hasDroppedTile: false
    };

    for (let x = 0; x < columns; x++) {
        let column: IColumn = [];

        for (let y = 0; y < rows; y++) {
            column[y] = { id: makeSquareId(x, y, columns), x, y, tile: null, ...initialSquare}
        }
        board[x] = column;
    }
    gameState.setDuringGameStatus()
    gameState.updateBoard(board);
}

export default initializeBoard;