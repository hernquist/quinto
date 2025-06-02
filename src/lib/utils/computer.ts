import type { IBoard, ITiles } from "$lib/components/game/types"
import type { GameState } from "$lib/state/game/game.svelte";
import { sumTotalScore } from "$lib/state/game/synchronousCalculateScore";
import { Direction, TurnStatus, type IDroppedTile, type IGameState, type ITurn } from "$lib/state/game/types"
import type { PlayerState } from "$lib/state/player/player.svelte";
import { Players, type IPlayer } from "$lib/state/player/types";

export interface IComputerTurn {
    droppedTiles: IDroppedTile[],
    turnStatus: TurnStatus,
    direction: Direction 
}

export interface ICandidateMove {
    score: number,
    candidateMove: ITurn
}

function tryTilesHorizontal(gameState: GameState, tiles: ITiles, numberOfTiles: number, x: number, y: number): ICandidateMove[] {
    let candidateTiles: IDroppedTile[] = [];
    let candidateMoves = []
    // iterate for each tile
    for (let tileIndex = 0; tileIndex < numberOfTiles; tileIndex++) {
        candidateTiles.push({ tile: tiles[tileIndex], x, y });

        // iterate for each tile after the first changing to multi placed
        const candidateTurn = {
            direction: Direction.Undecided,
            turnStatus: TurnStatus.OnePlaced,
            droppedTiles: candidateTiles,
            firstTurnOfRound: false // blarg
        };

        gameState.updateComputerCandidateTurn(candidateTurn);
        const score = sumTotalScore(gameState);

        // add move
        candidateMoves.push ({
            score,
            candidateMove: gameState.game.computerCandidateTurn
        })
        // reset
        gameState.resetComputerCandidateTurn();
        candidateTiles = [];
    }
    return candidateMoves;
}

function findSelectedPlay(candidateMoves: ICandidateMove[]): ICandidateMove {
    return candidateMoves.reduce((prev, current) => {
        return prev.score > current.score ? prev : current;
    });
}

export function getComputerTurn(gameState: GameState, playerState: PlayerState): IComputerTurn  {
    let candidateMoves: ICandidateMove[] = [];
    
    // get board
    const { board }: { board: IBoard} = gameState.game;
    console.log("[computer].getComputerTurn--gameState", gameState);
    console.log("[computer].getComputerTurn--board", JSON.stringify(board));

    // get computer as player 
    // TODO: do we need?
    const computerPlayer: IPlayer = playerState.player[Players.Bottom]; // TODO: needs to be dynamic
    
    // get computer's tiles
    const computerTiles: ITiles = playerState.getTiles(Players.Bottom); // TODO: needs to be dynamic
    const numberOfTiles = computerTiles.length;
    console.log("[computer].getComputerTurn--computerTiles", JSON.stringify(computerTiles));

    // loop through board try each tile
    const numberOfColumns = board.length;
    for (let x = 0; x < numberOfColumns; x++) {
        const numberOfRows = board[x].length;
        for (let y = 0; y < numberOfRows; y++) {
            // only look at dropzone "available" squares
            if (board[x][y].hasDropzone) {
                candidateMoves = [...candidateMoves, ...tryTilesHorizontal(gameState, computerTiles, numberOfTiles, x, y)];
            }
        }
    }

        // capture each play and attach a score to it
            // try an "adjacent square" going horizontally right for each remaining tile
            // capture each play and attach a score to it
                    // repeat until no dropzone sqaure are available 
            // try an "adjacent square" going vertical down for each remaining tile
            // capture each play and attach a score to it
                // repeat until no dropzone sqaure are available  

    // sort scores ??? not sure if I'll do it this way
        // make play
        // TODO: make play based on level
    console.log("[computer].getComputerTurn--candidateMoves", candidateMoves);
    const selectedPlay = findSelectedPlay(candidateMoves);
    console.log("[computer].getComputerTurn--selectedPlay", selectedPlay);
    
    return ({
        droppedTiles: selectedPlay.candidateMove.droppedTiles,
        turnStatus: selectedPlay.candidateMove.turnStatus,
        direction: selectedPlay.candidateMove.direction
    })
}