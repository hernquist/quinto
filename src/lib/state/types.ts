import type { IBoard, ITiles } from "$lib/components/game/types";

enum Players {
    Top = 'TOP',
    Bottom = 'BOTTOM',
}

enum GameStatus {
    Before = "BEFORE",
    During = "DURING",
    Finishing = "FINISHING",
    Complete = "COMPLETE"
}

interface IPlayer {
    score: number;
    goesFirst: boolean,
}

interface IGameState {
	round: number;
	status: GameStatus;
    activePlayer: Players;
	tiles: ITiles;
	rows: number;
	columns: number;
	totalSquares: number;
	gameMultiple: number;
    board: IBoard;
}

interface IPlayerTiles {
    [Players.Top]: ITiles;
    [Players.Bottom]: ITiles;
};

interface IPlayers {
    [Players.Top]: IPlayer;
    [Players.Bottom]: IPlayer;
}

export type { IPlayer, IGameState, IPlayerTiles, IPlayers };
export { Players, GameStatus }