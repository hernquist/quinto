import type { ITiles, ITile, IBoard } from "$lib/components/game/types";
import { GameStatus, Players, type IGameState, type IPlayer } from "./types";
import { setContext, getContext } from 'svelte';

const initState: IGameState = {
	round: 0,
	status: GameStatus.Before,
	activePlayer: Players.Top,
	tiles: [],
	rows: 0,
	columns: 0,
	totalSquares: 0,
	gameMultiple: 5,
	board: []
}

export class GameState {
	game = $state<IGameState>(initState);

	// I don't think we need the initialState here
	constructor (initState: IGameState) {
		this.game = initState;
	}

	updateTiles (tiles: ITiles) {
		this.game.tiles = tiles;
	}

	updateActivePlayer (playerPosition: Players) {
		this.game.activePlayer = playerPosition;
	}

	updateBoardSquare(x: number, y: number, tile: ITile): void {
		this.game.board[x][y] = { ...this.game.board[x][y], tile };
	} 
	
	updateBoard(board: IBoard): void {
		this.game.board = board;
	}
	
	updateBoardDimensions(rows: number, columns: number): void {
		this.game.rows = rows;
		this.game.columns = columns;
		this.game.totalSquares = rows * columns;
	}
}

const KEY = Symbol("GAME_STATE");

export function setGameState() {
	return setContext(KEY, new GameState(initState))
}

export function getGameState() {
	return getContext<ReturnType<typeof setGameState>>(KEY);
}
 
