import { setContext, getContext } from 'svelte';
import { GameStatus, Players, type IDroppedTile, type IGameState } from "./types";
import type { ITiles, ITile, IBoard } from "$lib/components/game/types";
import type { IPlayerState } from "./player.svelte";

const { Top, Bottom} = Players;

const initState: IGameState = {
	round: 0,
	status: GameStatus.Before,
	activePlayer: Players.Top,
	tiles: [],
	rows: 0,
	columns: 0,
	startingNumberOfSquares: 0,
	tilesPerPlayer: 5,
	gameMultiple: 5,
	board: [],
	turn: {
		firstTurnOfRound: true,
		droppedTiles: [],
	}
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

	updateTurn(x: number, y: number, tile: ITile): void {
		const droppedTile: IDroppedTile = { x, y, tile };
		this.game.turn.droppedTiles.push(droppedTile);
	}

	private getInactivePlayer(): Players {
		const activePlayer = this.game.activePlayer;
		if (activePlayer === Top) return Bottom;
		return Top;
	}

	private calculateScore(): number {
		const droppedTiles = this.game.turn.droppedTiles;
		return droppedTiles.reduce((acc, curr) => acc + curr.tile.value, 0)
	}

	private updateScore(playerState: IPlayerState): void {
		const score = this.calculateScore();
		playerState.player[this.game.activePlayer].score += score; 
		console.log("updating player ", this.game.activePlayer, score, "points")
	}

	private resetTurn(): void {
		this.game.turn.firstTurnOfRound = !this.game.turn.firstTurnOfRound;
		this.game.turn.droppedTiles = [];
	}

	// can I use in the initialize game function (make not private)
	private replenishTiles (playerState: IPlayerState): void {
		// no tiles
		if (this.game.tiles.length === 0) {
			console.log("no tiles left");
			return;
		}

		// get number of tiles needed
		const tilesPerPlayer = this.game.tilesPerPlayer;
		const currentNumberOfTiles = playerState.tiles[this.game.activePlayer].length;
		const numberOfTilesNeeded = tilesPerPlayer - currentNumberOfTiles;
		
		// partial replenish
		if (this.game.tiles.length < numberOfTilesNeeded) {
			console.log("Partial replenish: ", this.game.tiles.length, "tiles");
			playerState.tiles[this.game.activePlayer] = [...playerState.tiles[this.game.activePlayer], ...this.game.tiles];
			return;
		}

		// complete replish
		const neededTiles = this.game.tiles.splice(0, numberOfTilesNeeded);
		console.log("Partial replenish: ", numberOfTilesNeeded, "tiles");
		playerState.tiles[this.game.activePlayer] = [...playerState.tiles[this.game.activePlayer], ...neededTiles];
	}

	finishTurn(playerState: IPlayerState): void {
		this.updateScore(playerState);
		this.replenishTiles(playerState);
		this.updateActivePlayer(this.getInactivePlayer());
		// if second turn of round increment to next round
		if (!this.game.turn.firstTurnOfRound) {
			this.game.round++;
		}
		this.resetTurn();
	}
	
	updateBoardDimensions(rows: number, columns: number): void {
		this.game.rows = rows;
		this.game.columns = columns;
		this.game.startingNumberOfSquares = rows * columns;
	}
}

const KEY = Symbol("GAME_STATE");

export function setGameState() {
	return setContext(KEY, new GameState(initState))
}

export function getGameState() {
	return getContext<ReturnType<typeof setGameState>>(KEY);
}
 
