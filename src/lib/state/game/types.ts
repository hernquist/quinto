import type { IBoard, ITile, ITiles } from "$lib/components/game/types";
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
	tiles: ITiles;
	rows: number;
	columns: number;
	startingNumberOfSquares: number;
    tilesPerPlayer: number;
	gameMultiple: number;
    board: IBoard;
    turn: ITurn;
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

export type { IGameState, ITurn, IDroppedTile, ILineItem };
export { GameStatus, TurnStatus, DropzoneStatus, Direction }