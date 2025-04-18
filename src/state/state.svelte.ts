import type { ITiles, ITile, IBoard } from "$lib/components/game/types";
import { GameStatus, Players, type IGameState, type IPlayer } from "./types";

const { Top, Bottom } = Players; 

const gameState: IGameState = $state({
	round: 0,
	status: GameStatus.Before,
	activePlayer: Top,
	[Top]: {
		score: 0,
		goesFirst: false,
		tiles: []
	},
	[Bottom]: {
		score: 0,
		goesFirst: false,
		tiles: []
	},
	tiles: [],
	rows: 0,
	columns: 0,
	totalSquares: 0,
	gameMultiple: 5,
	board: []
});


export function getGameState() {
	return gameState;
}

export function getGameTiles(): ITiles {
	return gameState.tiles;
}

export function updateTiles(tiles: ITiles): void {
	gameState.tiles = tiles;
}

export function updatePlayer(playerPosition: Players, player: IPlayer): void {
	gameState[playerPosition] = player;
}

export function updateActivePlayer(activePlayer: Players) {
	gameState.activePlayer = activePlayer;
}

export function updatePlayerTiles(playerPosition: Players, tiles: ITiles): void {
	const player = gameState[playerPosition];
	gameState[playerPosition] = { ...player, tiles };
}

export function updateBoardSquare(x: number, y: number, tile: ITile): void {
	gameState.board[x][y] = { ...gameState.board[x][y], tile };
}  

export function updateBoard(board: IBoard): void {
	gameState.board = board;
}

export function updateBoardDimensions(rows: number, columns: number): void {
	gameState.rows = rows;
    gameState.columns = columns;
    gameState.totalSquares = rows * columns;
}