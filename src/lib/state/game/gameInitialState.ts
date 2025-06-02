import { Players } from "../player/types";
import { Direction, GameStatus, TurnStatus, type IGameState } from "./types";

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
		turnStatus: TurnStatus.ZeroPlaced,
        direction: Direction.Undecided
	},
	computerCandidateTurn: {
		firstTurnOfRound: true,
		droppedTiles: [],
		turnStatus: TurnStatus.ZeroPlaced,
        direction: Direction.Undecided
	}
}

export default initState;