import type { ISquare } from "./types";

function makeSquareId (x: number, y: number, columns: number): number {
    return x + y * columns;
}


function initBoard(columns: number, rows: number): ISquare[][] {
    let board: ISquare[][] = [];
    for (let x = 0; x < columns; x++ ){
        let column = []
        for (let y = 0; y < rows; y ++){
            column[y] = { id: makeSquareId(x, y, columns), x, y, tile: null}
        }
        board[x] = column;

    }
    console.log("board", board)
    return board;
}

export default initBoard;