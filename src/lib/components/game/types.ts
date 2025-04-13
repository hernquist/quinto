interface ITile {
    id: number;
    text: number;
    value: number;
}

interface ISquare {
    id: number;
    x: number;
    y: number;
    tile: ITile | null;
}

export type { ITile, ISquare };