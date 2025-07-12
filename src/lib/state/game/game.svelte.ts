import { setContext, getContext } from 'svelte';
import { addDropzoneOptions, checkForContinuousTiles, checkSurroundSquaresForASingleTile, getMinMaxTile, orderTilesByDimension, readLinesForScore, sleep } from './gameUtils';
import initState from './gameInitialState';
import { Direction, TurnStatus, type IDroppedTile, type IGameState, type ILineItem, GameStatus, type ITurn, type IIsValidPlay } from "$lib/state/game/types";
import { Players } from '$lib/state/player/types';
import type { IPlayerState, PlayerState } from "../player/player.svelte";
import type { ITile, IBoard, ICoordTuple } from "$lib/components/game/types";
import { ToastType, type IToastState } from '$lib/state/toast/types';
import { COMPUTER_THINKING_DURATION, HIGHLIGHT_DURATION, MAIN_TOAST_DURATION, type ToastState } from '../toast/toast.svelte';
import { getComputerTurn, type IComputerTurn } from '$lib/utils/computer';

const { Top, Bottom} = Players;

export class GameState {
	game = $state<IGameState>(initState);
	capturedBoard = $state<IBoard>([]);

	skippedTurn = false;
	finishTurnActivePlayer: Players = Players.Top;

	// I don't think we need the initialState here
	constructor (initState: IGameState) {
		this.game = initState;
	}

	public updateGameTiles (tiles: ITile[]) {
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

	public reInitializeGame() {
		this.game = initState;
		this.skippedTurn = false;
	}

	public updateComputerCandidateTurn (update: ITurn): void {
		this.game.computerCandidateTurn = { ...this.game.computerCandidateTurn, ...update };
	}

	public resetComputerCandidateTurn(): void {
		this.game.computerCandidateTurn = initState.computerCandidateTurn;
	}

	public isValidPlay(): IIsValidPlay {
		const { turn: { direction, droppedTiles }}: { turn: ITurn } = this.game;
		if (direction === Direction.Undecided) return { isValid: true, emptySquares: [] };

		const minTile = getMinMaxTile(droppedTiles, direction);
		const maxTile = getMinMaxTile(droppedTiles, direction, false);
		return checkForContinuousTiles(minTile, maxTile, this.game) 
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
	
	// for computer play
	public updateBulkTurn(droppedTiles: IDroppedTile[], playerState: PlayerState): void {
		// TODO: this needs to be dynamic
		// right now I am forcing the issue....
		//TODO: need to figure this out BIG TODO
		this.game.turn.turnStatus = droppedTiles.length === 1 ? TurnStatus.OnePlaced : TurnStatus.MultiPlaced;
		console.log("updateBulkTurn", this.game.turn.turnStatus);
		console.log("updateBulkTurn", JSON.parse(JSON.stringify(playerState)));
		// this.game.turn.turnStatus = TurnStatus.MultiPlaced;
		// also we need to set horizontal and vertical placement here 

		droppedTiles.forEach((droppedTile) => {
			const { x, y, tile } = droppedTile;
			this.updateBoardSquareWithTile(x, y, tile);
			// is this activePlayer working with the asynchronous computer play?
			playerState.removeTile(this.game.activePlayer, tile.id);
		});
		
		this.game.turn.droppedTiles = droppedTiles;
		// this.updateTurnStatus();
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
			console.error("{ getMultiPlacedDropzoneOptions } error: internal game state borken -- number of tiles", multiTilesPlaced.length);
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

	public getInactivePlayer(): Players {
		const activePlayer = this.game.activePlayer;
		if (activePlayer === Top) return Bottom;
		return Top;
	}

	// TODO: start using sychronousCalculateScore with this async func
	// TODO: add? ": Promise<number>" return type
	private async calculateScore(toastState: ToastState) {
		const { turn: { direction, droppedTiles}, gameMultiple } = this.game;
		let lines: ILineItem[][] = [];

		if (direction === Direction.Undecided && droppedTiles.length > 0) {
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

			// up and down
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
			return readLinesForScore(lines, gameMultiple, toastState);
		}

		// ------------------------------------
		if (direction === Direction.Horizontal) {
			// order dropped tiles from the left to right
			const orderedDroppedTiles = droppedTiles.sort((a, b) => orderTilesByDimension(a, b, "x"));

			const lastIndex = orderedDroppedTiles.length - 1;
			const firstSquare: IDroppedTile = orderedDroppedTiles[0];
			const middleSquares: IDroppedTile[] = orderedDroppedTiles.slice(1, lastIndex);
			const lastSquare: IDroppedTile = orderedDroppedTiles[lastIndex];
			
			
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

			// -------------------------------------------

			// calculate "lines" score
			return readLinesForScore(lines, gameMultiple, toastState);
		}

		// ------------------------------------------------------------------
		if (direction === Direction.Vertical) {
			// order dropped tiles from top to bottom
			const orderedDroppedTiles: IDroppedTile[] = droppedTiles.sort((a, b) => orderTilesByDimension(a, b, "y"));

			const lastIndex = orderedDroppedTiles.length - 1;
			const firstSquare: IDroppedTile = orderedDroppedTiles[0];
			const middleSquares: IDroppedTile[] = orderedDroppedTiles.slice(1, lastIndex);
			const lastSquare: IDroppedTile = orderedDroppedTiles[lastIndex];
	
			// determine "line" for vertical placement
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
				hasAdjacentTile = true;
				line = [];

				// TODO: fix tile error -- see above
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
			// calculate "lines" score
			return readLinesForScore(lines, gameMultiple, toastState);
		}

		console.error("Error: calculation not working...")
		return 0;
	}

	private async updateScore(playerState: IPlayerState, toastState: ToastState): void {
		const score = await this.calculateScore(toastState);
		playerState.player[this.finishTurnActivePlayer].score += score; 
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

	public async finishTurn(playerState: PlayerState, toastState: ToastState): Promise<void> {
		this.finishTurnActivePlayer = this.game.activePlayer;

		if (!this.skippedTurn) {
			this.updateScore(playerState, toastState);
			this.replenishTiles(playerState);
		} else {
			this.skippedTurn = false;
		}

		await sleep(() => {
			this.updateActivePlayer(this.getInactivePlayer());
			// if second turn of round increment to next round
			if (!this.game.turn.firstTurnOfRound) {
				this.game.round++;
			}
			this.checkForEndOfGameStatus(playerState);
	
			if (this.game.status === GameStatus.Complete) {
				// handle game over
				const { isTieGame } = playerState.setWinner(this.game);
				if (isTieGame) {
					this.game.status = GameStatus.Tie;
				}
			} 
			this.resetForNextTurn();
			this.updateBoardAfterTileDrop();
	
			// if active player has no tiles but the other play does...
			console.log("from finishTurn sleep activePlayer:",this.game.activePlayer);
			console.log("from finishTurn sleep inActivePlayer:",this.getInactivePlayer(), playerState);
			if (playerState.hasNoTiles(this.game.activePlayer) && !playerState.hasNoTiles(this.getInactivePlayer())) {
				toastState.addQueuedMessage("", `${this.game.activePlayer} has no tiles... ${this.getInactivePlayer()}'s turn`, this.game.activePlayer, ToastType.PLAYER_MESSGAGE);
				// set skippedTurn to true so we can activate a finishTurn in the component
				this.skippedTurn = true;
				console.log("skippedTurn set to true");
			} else {
				this.captureBoard();
			}
		},  HIGHLIGHT_DURATION * toastState.numberOfLines + MAIN_TOAST_DURATION);

		toastState.fireMessages();
	}

	public async computerTurn(playerState: PlayerState, toastState: ToastState): Promise<void> {
        toastState.add("TITLE", "Computer is thinking...", ToastType.PLAYER_MESSGAGE, COMPUTER_THINKING_DURATION)

		await sleep(async () => {
			const cpuTurn: IComputerTurn = getComputerTurn(this, playerState);
			this.updateBulkTurn(cpuTurn.droppedTiles, playerState);
			// TODO: gameState.updateTurnStatus(cpuTurn.turnStatus);
			// TODO: gameState.setDirection (cpuTurn.direction);
		}, COMPUTER_THINKING_DURATION);
		await this.finishTurn(playerState, toastState);
	};

	public captureBoard() {
		this.capturedBoard = JSON.parse(JSON.stringify(this.game.board));
	}
	
	// make part of a bigger options arg
	public updateBoardDimensions({ rows, columns }: { rows: number, columns: number} ): void {
		this.game.rows = rows;
		this.game.columns = columns;
		this.game.startingNumberOfSquares = rows * columns;
	}

	public updateGameMultiple(gameMultiple: number): void {
		this.game.gameMultiple = gameMultiple;
	}

	public updatePlayLevel(playLevel: number): void {
		this.game.playLevel = playLevel;
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
 