import type { IBoard, ITile, ITiles } from "$lib/components/game/types";

enum Players {
    Top = 'TOP',
    Bottom = 'BOTTOM',
}

enum GameStatus {
    Before = "BEFORE",
    During = "DURING",
    OnePlayerDone = "ONE_PLAYER_DONE",
    Complete = "COMPLETE"
}

interface IPlayer {
    score: number;
    goesFirst: boolean,
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

interface IPlayerTiles {
    [Players.Top]: ITiles;
    [Players.Bottom]: ITiles;
};

interface IPlayers {
    [Players.Top]: IPlayer;
    [Players.Bottom]: IPlayer;
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

export type { IPlayer, IGameState, IPlayerTiles, IPlayers, ITurn, IDroppedTile, ILineItem };
export { Players, GameStatus, TurnStatus, DropzoneStatus, Direction }