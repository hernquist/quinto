import type { ITiles, ITile, IBoard } from "$lib/components/game/types";
import { GameStatus, Players, type IGameState, type IPlayer } from "./types";
import { setContext, getContext } from 'svelte';

const { Top, Bottom } = Players; 

const initState: IGameState = {
	round: 0,
	status: GameStatus.Before,
	activePlayer: Top,
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
		console.log("playerPosition", playerPosition);
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
 
// player -- needs to be updated to context and state
let topPlayer: IPlayer = $state({
	score: 0,
	goesFirst: false,
});

let bottomPlayer: IPlayer = $state({
	score: 0,
	goesFirst: false,
})

export function getPlayer(playerPosition: Players): IPlayer {
	if (playerPosition === Top) return topPlayer;
	return bottomPlayer;
}

export function updatePlayer(playerPosition: Players, player: IPlayer): void {
	if (playerPosition === Top) topPlayer = player
	if (playerPosition === Bottom) bottomPlayer = player;
}