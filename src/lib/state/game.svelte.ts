import { setContext, getContext } from 'svelte';
import { DropzoneStatus, GameStatus, Players, TurnStatus, type IDroppedTile, type IGameState } from "./types";
import type { ITiles, ITile, IBoard, ICoordTuple } from "$lib/components/game/types";
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
		turnStatus: TurnStatus.ZeroPlaced
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

	updateBoardSquareWithTile(x: number, y: number, tile: ITile): void {
		this.game.board[x][y] = { ...this.game.board[x][y], tile };
	} 
	
	updateBoard(board: IBoard): void {
		this.game.board = board;
	}
	
	updateTurnStatus() {
		if (this.game.turn.turnStatus === TurnStatus.ZeroPlaced) {
			this.game.turn.turnStatus = TurnStatus.OnePlaced;
			return;
		}
		if (this.game.turn.turnStatus === TurnStatus.OnePlaced) {
			this.game.turn.turnStatus = TurnStatus.MultiPlaced;
			return;
		}
	}

	updateBoardAfterTileDrop() {
		const allowList = this.getDropzoneAllowlist();
		const xDim = this.game.columns - 1;
		const yDim = this.game.rows - 1;

		for (let x = 0; x < xDim; x++) {
			for (let y = 0; y < yDim; y++) {
				if (allowList === DropzoneStatus.Complete) {
					this.game.board[x][y] = { ...this.game.board[x][y], hasDropzoneeeee: true}
				} else {
					const isAllowed = allowList.reduce((acc: any, curr: any) => {
						const [xAllowed, yAllowed] = curr;
						if (xAllowed === x && yAllowed === y) {
							acc = true;
						}
						return acc;
					}, false);
					if (isAllowed) {
						this.game.board[x][y] = { ...this.game.board[x][y], hasDropzoneeeee: true}
					}
				}	
			}
		}
	}

	updateTurn(x: number, y: number, tile: ITile): void {
		const droppedTile: IDroppedTile = { x, y, tile };
		this.game.turn.droppedTiles.push(droppedTile);
		
		this.updateTurnStatus();

		this.updateBoardAfterTileDrop();
	}

	getDropzoneAllowlist() {
		const constraints = {
			[TurnStatus.ZeroPlaced]: this.hasStartingSquare() ? [this.getStartingSquareCoordinates()] : DropzoneStatus.Complete,
			[TurnStatus.OnePlaced]: DropzoneStatus.Complete,
			[TurnStatus.MultiPlaced]: [],
			[TurnStatus.Disconnected]: [],
			[TurnStatus.DisconnectedInvalid]: [],
			[TurnStatus.Invalid]: []
		}
		return constraints[this.game.turn.turnStatus] || []
	} 

	hasStartingSquare() {
		return this.game.round === 0 && this.game.turn.firstTurnOfRound;
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

	getStartingSquareCoordinates(): ICoordTuple {
		const x = Math.trunc((this.game.columns - 1) /2);
		const y = Math.trunc((this.game.rows -1) /2);
		return [x, y];
	}

	setStartingSquare(): void {
		const [x, y] = this.getStartingSquareCoordinates();
		this.game.board[x][y] = { ...this.game.board[x][y], startingSquare: true}
	}
}

const KEY = Symbol("GAME_STATE");

export function setGameState() {
	return setContext(KEY, new GameState(initState))
}

export function getGameState() {
	return getContext<ReturnType<typeof setGameState>>(KEY);
}
 
