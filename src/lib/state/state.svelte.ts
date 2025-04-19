import type { ITiles, ITile, IBoard } from "$lib/components/game/types";
import { GameStatus, Players, type IGameState, type IPlayer } from "./types";

const { Top, Bottom } = Players; 

const gameState: IGameState = $state({
	round: 0,
	status: GameStatus.Before,
	activePlayer: Top,
	tiles: [],
	rows: 0,
	columns: 0,
	totalSquares: 0,
	gameMultiple: 5,
	board: []
});

let topPlayer: IPlayer = $state({
	score: 0,
	goesFirst: false,
 });

 let bottomPlayer: IPlayer = $state({
	score: 0,
	goesFirst: false,
 })


export function getGameState() {
	return gameState;
}

export function getGameTiles(): ITiles {
	return gameState.tiles;
}

export function getPlayer(playerPosition: Players): IPlayer {
	if (playerPosition === Top) return topPlayer;
	return bottomPlayer;
}

export function updateTiles(tiles: ITiles): void {
	gameState.tiles = tiles;
}

export function updatePlayer(playerPosition: Players, player: IPlayer): void {
	if (playerPosition === Top) topPlayer = player
	if (playerPosition === Bottom) bottomPlayer = player;
}

export function updateActivePlayer(activePlayer: Players) {
	gameState.activePlayer = activePlayer;
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