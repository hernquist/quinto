import type { IBoard, ITile } from "$lib/components/game/types";
import type { Players } from "../player/types";

enum GameStatus {
    Before = "BEFORE",
    During = "DURING",
    OnePlayerDone = "ONE_PLAYER_DONE",
    Complete = "COMPLETE",
    Tie = "TIE"
}

interface IDroppedTile {
    tile: ITile,
    x: number;
    y: number;
}

enum TurnStatus {
    ZeroPlaced = "zeroPlaced",
    OnePlaced = "onePlaced",
    MultiPlaced = "multiPlaced",
    Disconnected = "disconnected",
    DisconnectedInvalid = "disconnectedInvalid",
    Invalid = "inValid"
}

enum DropzoneStatus {
    Complete = 'complete'
}

interface ITurn {
    firstTurnOfRound: boolean; // is there a better way of doing this?
    droppedTiles: IDroppedTile[];
    turnStatus: TurnStatus;
    direction: Direction;
}

interface IGameState {
	round: number;
	status: GameStatus;
    activePlayer: Players;
	tiles: ITile[];
	rows: number;
	columns: number;
	startingNumberOfSquares: number;
    tilesPerPlayer: number;
	gameMultiple: number;
    board: IBoard;
    turn: ITurn;
    computerCandidateTurn: ITurn;
    playLevel: number;
}

enum Direction {
    Horizontal = 'horizontal',
    Vertical = 'vertical',
    Undecided = 'undecided'
}

interface ILineItem {
    x: number;
    y: number;
    value: number;
}

enum Axis {
    X = "x",
    Y = "y"
}

interface IKeyMap {
    [Direction.Horizontal]: Axis,
    [Direction.Vertical]: Axis,
}

type IEmptySquare = Record<Axis, number>;

interface IIsValidPlay {
    isValid: boolean,
    emptySquares: any[];
}

type ICalculateScore = {
    lines: ILineItem[][],
    gameMultiple: number
}

export type { IGameState, ITurn, IDroppedTile, ILineItem, IKeyMap, IIsValidPlay, IEmptySquare, ICalculateScore };
export { GameStatus, TurnStatus, DropzoneStatus, Direction, Axis };