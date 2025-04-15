import { GameStatus, Players, type IGameState } from "./types";

const { Top, Bottom } = Players; 

export const gameState: IGameState = $state({
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