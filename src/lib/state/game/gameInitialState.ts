import { boards, Sizes } from "$lib/constants/boards";
import { Players } from "../player/types";
import { Direction, GameStatus, TurnStatus, type IGameState } from "./types";

const initBoard = Sizes.FiveByFive

const initState: IGameState = {
	round: 0,
	status: GameStatus.Before,
	activePlayer: Players.Top,
	tiles: [],
	rows: boards[initBoard].rows,
	columns: boards[initBoard].columns,
	boardType: initBoard,
	startingNumberOfSquares: 0,
	tilesPerPlayer: 5,
	gameMultiple: 5,
	board: [],
	turn: {
		firstTurnOfRound: true,
		droppedTiles: [],
		turnStatus: TurnStatus.ZeroPlaced,
        direction: Direction.Undecided
	},
	computerCandidateTurn: {
		firstTurnOfRound: true,
		droppedTiles: [],
		turnStatus: TurnStatus.ZeroPlaced,
        direction: Direction.Undecided
	},
	playLevel: 5
}

export default initState;