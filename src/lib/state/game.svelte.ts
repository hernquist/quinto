import { setContext, getContext } from 'svelte';
import { Players, Direction, TurnStatus, type IDroppedTile, type IGameState, type ILineItem, GameStatus } from "./types";
import type { ITiles, ITile, IBoard, ICoordTuple } from "$lib/components/game/types";
import type { IPlayerState } from "./player.svelte";
import { addDropzoneOptions, checkSurroundSquaresForASingleTile, readLinesForScore } from './gameUtils';
import initState from './gameInitialState';
import type { IToastState } from './toast/types';

const { Top, Bottom} = Players;

export class GameState {
	game = $state<IGameState>(initState);
	capturedBoard = $state<IBoard>([]);

	// I don't think we need the initialState here
	constructor (initState: IGameState) {
		this.game = initState;
	}

	public updateTiles (tiles: ITiles) {
		this.game.tiles = tiles;
	}

	public setHoveringTrue (x: number, y: number): void {
		this.game.board[x][y].hovering = true;
	}

	public setHoveringFalse (x: number, y: number): void {
		this.game.board[x][y].hovering = false;
	}

	public setDuringGameStatus(): void {
		this.game.status = GameStatus.During;
	}

	public updateActivePlayer (playerPosition: Players) {
		this.game.activePlayer = playerPosition;
	}

	public updateBoardSquareWithTile(x: number, y: number, tile: ITile): void {
		this.game.board[x][y] = { ...this.game.board[x][y], tile, hasDroppedTile: true };
	} 
	
	public updateBoard(board: IBoard): void {
		this.game.board = board;
	}
	
	private updateTurnStatus() {
		if (this.game.turn.turnStatus === TurnStatus.OnePlaced) {
			this.game.turn.turnStatus = TurnStatus.MultiPlaced;
			return;
		}
		if (this.game.turn.turnStatus === TurnStatus.ZeroPlaced) {
			this.game.turn.turnStatus = TurnStatus.OnePlaced;
			return;
		}
	}

	public updateBoardAfterTileDrop() {
		const allowList = this.getDropzoneAllowlist() || [];

		for (let x = 0; x < this.game.columns; x++) {
			for (let y = 0; y < this.game.rows; y++) {
				const isAllowed = allowList.reduce((acc: any, curr: any) => {
					const [xAllowed, yAllowed] = curr;
					if (xAllowed === x && yAllowed === y) acc = true;
					return acc;
				}, false);
				this.game.board[x][y] = { ...this.game.board[x][y], hasDropzone: isAllowed}
			}
		}
	}

	private removeDroppedTileImprintFromBoard() {
		for (let x = 0; x < this.game.columns; x++) {
			for (let y = 0; y < this.game.rows; y++) {
					this.game.board[x][y] = { ...this.game.board[x][y], hasDroppedTile: false}
			}
		}
	}

	public updateTurn(x: number, y: number, tile: ITile): void {
		const droppedTile: IDroppedTile = { x, y, tile };
		this.game.turn.droppedTiles.push(droppedTile);
		this.updateTurnStatus();
		this.updateBoardAfterTileDrop();
	}

	private getSinglePlacedDropzoneOptions() {
		const singleTilePlaced = this.game?.turn?.droppedTiles || [];
		if (singleTilePlaced.length !== 1) {
			console.error("getSinglePlacedDropzoneOptions error: internal game state borken -- number of tiles", singleTilePlaced.length);
			return;
		}
		const [tile] = singleTilePlaced;
		let dropzoneOptions: IDroppedTile[] = [];
		dropzoneOptions = addDropzoneOptions(this.game.rows, tile, Direction.Vertical, dropzoneOptions);
		dropzoneOptions = addDropzoneOptions(this.game.columns, tile, Direction.Horizontal, dropzoneOptions);
		return dropzoneOptions;
	}

	private getMultiPlacedDropzoneOptions() {
		const multiTilesPlaced = this.game.turn.droppedTiles;
		if (multiTilesPlaced.length < 2) {
			console.error("{getMultiPlacedDropzoneOptions} error: internal game state borken -- number of tiles", multiTilesPlaced.length);
			return;
		}
		const [firstTile, secondTile] = multiTilesPlaced;

		if (firstTile.x === secondTile.x) this.game.turn.direction = Direction.Vertical;
		if (firstTile.y === secondTile.y) this.game.turn.direction = Direction.Horizontal;
		
		let dropzoneOptions: IDroppedTile[] = [];
		const direction = this.game.turn.direction;
		if (direction === Direction.Vertical) {
			dropzoneOptions = addDropzoneOptions(this.game.rows, firstTile, direction, dropzoneOptions) 
		} 
		if (direction === Direction.Horizontal) {
			dropzoneOptions = addDropzoneOptions(this.game.columns, firstTile, direction, dropzoneOptions) 
		}
		return dropzoneOptions;
	}

	private hasTile(x:number, y: number): boolean {
		return Boolean(this.game.board[x][y].tile);
	}

	private getAvailableDropzoneSquares() {
		const dropzoneOptions = [];
		for (let y = 0; y < this.game.rows; y++) {
			for (let x = 0; x < this.game.columns; x++) {
				if (!this.hasTile(x, y) && checkSurroundSquaresForASingleTile(this.game.board, x, y)) {
					dropzoneOptions.push([x, y])
				}
			}
		}
		return dropzoneOptions;
	}

	private getDropzoneAllowlist() {
		const { ZeroPlaced, OnePlaced, MultiPlaced, Disconnected, DisconnectedInvalid, Invalid } = TurnStatus;
		const turnStatus = this.game.turn.turnStatus;

		// beginning of turn
		if (turnStatus === ZeroPlaced) {
			if (this.hasStartingSquare()) {
				// special case of first move -- 1st tile must be placed on starting square
				return [this.getStartingSquareCoordinates()];
			}
			return this.getAvailableDropzoneSquares();
		} 
		// one tile placed 
		if (turnStatus === OnePlaced) return this.getSinglePlacedDropzoneOptions();
		// more than one tile paced
		if (turnStatus === MultiPlaced) return this.getMultiPlacedDropzoneOptions();
		// other cases
		if ([Disconnected, DisconnectedInvalid, Invalid].includes(turnStatus)) return [];
		return [];
	} 

	private hasStartingSquare() {
		return this.game.round === 0 && this.game.turn.firstTurnOfRound;
	}

	private getInactivePlayer(): Players {
		const activePlayer = this.game.activePlayer;
		if (activePlayer === Top) return Bottom;
		return Top;
	}

	private calculateScore(toastState: IToastState): number {
		const { turn: { direction, droppedTiles}, gameMultiple } = this.game;
		console.log("[game].calculateScore.droppedTiles:", droppedTiles);
		let lines: ILineItem[][] = [];

		if (direction === Direction.Undecided) {
			// search left
			const [square] = droppedTiles;
			const { x, y, tile: { value }} = square;

			// set up -- shift left
			let hasAdjacentTile = true
			
			let line: ILineItem[] = [];
			let shiftLeft = 1;
			do {
				if (this.game.board?.[x - shiftLeft]?.[y]?.tile) {
					if (line.length === 0) { 
							line.push({ x, y, value })
					};
					line.push({ 
						x: x - shiftLeft, 
						y, 
						value: this.game.board[x - shiftLeft][y].tile?.value || 0 
					});
					shiftLeft += 1;
				} else {
					hasAdjacentTile = false;
				}
			} while (hasAdjacentTile);

			let shiftRight = 1;
			hasAdjacentTile = true;
			do {
				if (this.game.board?.[x + shiftRight]?.[y]?.tile) {
					if (line.length === 0) {
						line.push({ x, y, value });
					}
					line.push({ 
						x: x + shiftRight, 
						y, 
						value: this.game.board[x + shiftRight][y].tile?.value || 0 
					});
					shiftRight += 1;
				} else {
					hasAdjacentTile = false;
				}
			} while (hasAdjacentTile)
			
			if (line.length !== 0) {
				lines.push(line);
			}

			// up and and down
			hasAdjacentTile = true;
			// shift "up"
			line = [];
			let shiftUp = 1
			do {
				if (this.game.board?.[x]?.[y - shiftUp]?.tile) {
					if (line.length === 0) { 
						line.push({x, y, value})
					};
					line.push({ 
						x: x, 
						y: y - shiftUp, 
						value: this.game.board[x][y - shiftUp]?.tile?.value || 0 
					});
					shiftUp += 1;
				} else {
					hasAdjacentTile = false;
				}
			} while (hasAdjacentTile);

			let shiftDown = 1;
			hasAdjacentTile = true;
			do {
				if (this.game.board?.[x]?.[y + shiftDown]?.tile) {
					if (line.length === 0) {
						line.push({x, y, value});
					}
					line.push({ 
						x, 
						y: y + shiftDown, 
						value: this.game.board[x][y + shiftDown].tile?.value || 0 
					});
					shiftDown += 1;
				} else {
					hasAdjacentTile = false;
				}
			} while (hasAdjacentTile)
			
			if (line.length !== 0) {
				lines.push(line);
			}

			// handle empty line -- single, untouched tile
			if (lines.length === 0) {
				lines.push([{ x, y, value } ])
			}
			console.log("[game].calculateScore.lines:", lines);
			return readLinesForScore(lines, gameMultiple, toastState);
		}

		// TODO: move
		function orderTilesByDimension(tileA:IDroppedTile, tileB: IDroppedTile, key: "x" | "y"): number {
			if (tileA[key] > tileB[key]) return 1;
			if (tileA[key] < tileB[key]) return -1;
			return 0;
		}

		// ------------------------------------
		if (direction === Direction.Horizontal) {
			
			// order dropped tiles from the left to right
			let orderedDroppedTiles = droppedTiles.sort((a, b) => orderTilesByDimension(a, b, "x"));

			// TODO: fix type error
			const lastSquare: IDroppedTile = orderedDroppedTiles.pop() ;
			const [firstSquare, ...middleSquares]: IDroppedTile[] = orderedDroppedTiles;
			
			
			// determine "line" for horizontal placement
			// some init
			let hasAdjacentTile = true;
			let line: ILineItem[] = []
			let shiftLeft = 1;
			
			// add first square to line
			let { x, y, tile: { value }} = firstSquare; 
			line.push({x, y, value});
			
			do {
				if (this.game.board?.[x - shiftLeft]?.[y]?.tile) {
					line.push({
						x: x - shiftLeft,
						y,
						value: this.game.board[x - shiftLeft][y].tile?.value || 0
					});
					shiftLeft += 1;
				} else {
					hasAdjacentTile = false
				}
			} while (hasAdjacentTile)

			let shiftRight = 1;
			hasAdjacentTile = true;

			do {
				if (this.game.board?.[x + shiftRight]?.[y]?.tile) {
					line.push({ 
						x: x + shiftRight, 
						y, 
						value: this.game.board[x + shiftRight][y].tile?.value || 0 
					});
					shiftRight += 1;
				} else {
					hasAdjacentTile = false;
				}
			} while (hasAdjacentTile)

			lines.push(line);

			// check each droppedTiles vertical "line" possibility
			// orginal droppedTiles 
			// TODO: this is a little suspect and somewhat typed to the type error above
			const newConstitutedDroppedTiles = [firstSquare, ...middleSquares, lastSquare];
			for (let i = 0; i < newConstitutedDroppedTiles.length; i++) {
				console.log("i and newConstitutedDroppedTiles.length:", i, newConstitutedDroppedTiles.length, newConstitutedDroppedTiles);
				hasAdjacentTile = true;
				line = [];

				const { x, y, tile: { value }} = newConstitutedDroppedTiles[i];
				// checking above
				let shiftUp = 1;
				do {
					if (this.game.board?.[x]?.[y - shiftUp]?.tile) {
						if (line.length === 0) { 
							line.push({x, y, value})
						};
						line.push({ 
							x: x, 
							y: y - shiftUp, 
							value: this.game.board[x][y - shiftUp]?.tile?.value || 0 
						});
						shiftUp += 1;
					} else {
						hasAdjacentTile = false;
					}
				} while (hasAdjacentTile);

				let shiftDown = 1
				hasAdjacentTile = true 
				do {
					if (this.game.board?.[x]?.[y + shiftDown]?.tile) {
						if (line.length === 0) {
							line.push({x, y, value});
						}
						line.push({ 
							x, 
							y: y + shiftDown, 
							value: this.game.board[x][y + shiftDown].tile?.value || 0 
						});
						shiftDown += 1;
					} else {
						hasAdjacentTile = false;
					}
				} while (hasAdjacentTile);
				if (line.length !== 0) {
					lines.push(line)
				}
			}

			console.log("[game].calculateScore.lines:", lines);
			// -------------------------------------------

			// calculate "lines" score
			return readLinesForScore(lines, gameMultiple, toastState);
		}

		// ------------------------------------------------------------------
		if (direction === Direction.Vertical) {
			// order dropped tiles from top to bottom
			let orderedDroppedTiles = droppedTiles.sort((a, b) => orderTilesByDimension(a, b, "y"));
			console.log("[game].calculateScore.orderedDroppedTiles.VERTICAL:", orderedDroppedTiles);

			// TODO: fix type error
			const lastSquare: IDroppedTile = orderedDroppedTiles.pop() ;
			const [firstSquare, ...middleSquares]: IDroppedTile[] = orderedDroppedTiles;
	
			// determine "line" for verticl placement
			// some init
			let hasAdjacentTile = true;
			let line: ILineItem[] = []
			let shiftUp = 1;
	
			// add first square to line
			let { x, y, tile: { value }} = firstSquare; 
			line.push({x, y, value});
			do {
				if (this.game.board?.[x]?.[y - shiftUp]?.tile) {
					line.push({
						x,
						y: y - shiftUp,
						value: this.game.board[x][y - shiftUp].tile?.value || 0
					});
					shiftUp += 1;
				} else {
					hasAdjacentTile = false
				}
			} while (hasAdjacentTile)

			let shiftDown = 1;
			hasAdjacentTile = true;

			do {
				if (this.game.board?.[x]?.[y + shiftDown]?.tile) {
					line.push({ 
						x, 
						y: y + shiftDown, 
						value: this.game.board[x][y + shiftDown].tile?.value || 0 
					});
					shiftDown += 1;
				} else {
					hasAdjacentTile = false;
				}
			} while (hasAdjacentTile)

			lines.push(line);

			// check each droppedTiles horizontal "line" possibility
			// orginal droppedTiles 
			// TODO: this is a little suspect and somewhat typed to the type error above
			const newConstitutedDroppedTiles = [firstSquare, ...middleSquares, lastSquare];
			for (let i = 0; i < newConstitutedDroppedTiles.length; i++) {
				console.log("i and newConstitutedDroppedTiles.length:", i, newConstitutedDroppedTiles.length, newConstitutedDroppedTiles);
				hasAdjacentTile = true;
				line = [];

				const { x, y, tile: { value }} = newConstitutedDroppedTiles[i];
				// checking left
				let shiftLeft = 1;
				do {
					if (this.game.board?.[x - shiftLeft]?.[y]?.tile) {
						if (line.length === 0) { 
							line.push({x, y, value})
						};
						line.push({ 
							x: x - shiftLeft, 
							y: y, 
							value: this.game.board[x - shiftLeft][y]?.tile?.value || 0 
						});
						shiftLeft += 1;
					} else {
						hasAdjacentTile = false;
					}
				} while (hasAdjacentTile);

				let shiftRight = 1;
				hasAdjacentTile = true; 
				do {
					if (this.game.board?.[x + shiftRight]?.[y]?.tile) {
						if (line.length === 0) {
							line.push({x, y, value});
						}
						line.push({ 
							x: x + shiftRight, 
							y, 
							value: this.game.board[x + shiftRight][y].tile?.value || 0 
						});
						shiftRight += 1;
					} else {
						hasAdjacentTile = false;
					}
				} while (hasAdjacentTile);

				if (line.length !== 0) {
					lines.push(line)
				}
			}

			console.log("[game].calculateScore.lines:", lines);
			// -------------------------------------------

			// calculate "lines" score
			return readLinesForScore(lines, gameMultiple, toastState);
		}
		// ------------------------------------------------------------------

		console.error("Error: calculation not working...")
		return 0;
	}

	private updateScore(playerState: IPlayerState, toastState: IToastState): void {
		const score = this.calculateScore(toastState);
		playerState.player[this.game.activePlayer].score += score; 
	}

	// reset for next player
	private resetForNextTurn(): void {
		this.game.turn.firstTurnOfRound = !this.game.turn.firstTurnOfRound;
		this.game.turn.droppedTiles = [];
		this.removeDroppedTileImprintFromBoard();
		this.game.turn.turnStatus = TurnStatus.ZeroPlaced;
		this.game.turn.direction = Direction.Undecided;
	}

	// reset reset turn for the same player via a button click
	public resetTurn(playerState: IPlayerState): void {
		this.game.turn.droppedTiles.forEach((droppedTile) => {
			const { x, y, tile } = droppedTile;
			playerState.tiles[this.game.activePlayer].push(tile) 
		})
		this.game.board = JSON.parse(JSON.stringify(this.capturedBoard));
		this.game.turn.droppedTiles = [];
		this.game.turn.turnStatus = TurnStatus.ZeroPlaced;
		this.game.turn.direction = Direction.Undecided;
	}

	// can I use in the initialize game function (make not private)
	private replenishTiles (playerState: IPlayerState): void {
		// no tiles
		if (this.game.tiles.length === 0) return;

		// get number of tiles needed
		const tilesPerPlayer = this.game.tilesPerPlayer;
		const currentNumberOfTiles = playerState.tiles[this.game.activePlayer].length;
		const numberOfTilesNeeded = tilesPerPlayer - currentNumberOfTiles;
		
		// partial replenish
		if (this.game.tiles.length < numberOfTilesNeeded) {
			playerState.tiles[this.game.activePlayer] = [...playerState.tiles[this.game.activePlayer], ...this.game.tiles];
			// tiles complete
			this.game.tiles = [];
			return;
		}

		// complete replish
		const neededTiles = this.game.tiles.splice(0, numberOfTilesNeeded);
		playerState.tiles[this.game.activePlayer] = [...playerState.tiles[this.game.activePlayer], ...neededTiles];
	}

	private checkForEndOfGameStatus(playerState: IPlayerState) {
		// check if game over
		if (playerState.tiles[Top].length === 0 && playerState.tiles[Bottom].length === 0) {
			this.game.status = GameStatus.Complete;
			// show modal
		} else {
			// check for one player down
			const activePlayer = this.game.activePlayer
			if (playerState.tiles[activePlayer].length === 0) {
				this.game.status = GameStatus.OnePlayerDone
				// we need to handle this
				// show a modal?
				// skip turn? Or just penalize the player with tiles left?
			} 
		}
		
	}

	public finishTurn(playerState: IPlayerState, toastState: IToastState): void {

		this.updateScore(playerState, toastState);
		this.replenishTiles(playerState);
		this.updateActivePlayer(this.getInactivePlayer());
		// if second turn of round increment to next round
		if (!this.game.turn.firstTurnOfRound) {
			this.game.round++;
		}
		this.checkForEndOfGameStatus(playerState);

		if (this.game.status === GameStatus.Complete) {
			// handle game over
		} 
		this.resetForNextTurn();
		this.updateBoardAfterTileDrop();
		this.captureBoard();
	}

	public captureBoard() {
		this.capturedBoard = JSON.parse(JSON.stringify(this.game.board));
	}
	
	public updateBoardDimensions(rows: number, columns: number): void {
		this.game.rows = rows;
		this.game.columns = columns;
		this.game.startingNumberOfSquares = rows * columns;
	}

	public getStartingSquareCoordinates(): ICoordTuple {
		const x = Math.trunc((this.game.columns - 1) /2);
		const y = Math.trunc((this.game.rows -1) /2);
		return [x, y];
	}

	public setStartingSquare(): void {
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
 