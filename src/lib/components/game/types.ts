interface ITile {
    id: number;
    text: number;
    value: number;
}

type ICoordTuple = [number, number]

interface ISquare {
    id: number;
    x: number;
    y: number;
    tile: ITile | null;
    startingSquare?: boolean;
}

type ITiles = ITile[];

type IRow = ISquare[];
type IColumn = ISquare[];
type IBoard = ISquare[][];

export type { ITile, ISquare, ITiles, IRow, IColumn, IBoard, ICoordTuple };