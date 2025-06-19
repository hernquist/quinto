import type { IBoard, ITile } from "$lib/components/game/types"
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

function get(arr) {
    const res = [];

    function help(curr, remain) {
        if (remain.length === 0) {
            if (curr.length > 0) {
                res.push(curr);
            }
            return;
        }

        help([...curr, remain[0]], remain.slice(1));

        help(curr, remain.slice(1));
    }

    help([], arr);
    return res;
}

function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

// Function to find the possible permutations.
// Initial value of idx is 0.
function permutations(res, arr, idx) {
    if (idx === arr.length) {
        res.push([...arr]);
        return;
    }

    for (let i = idx; i < arr.length; i++) {
        swap(arr, idx, i);
        permutations(res, arr, idx + 1);
        swap(arr, idx, i); // Backtracking
    }
}

// Function to get the permutations
function permute(arr) {
    const res = [];
    permutations(res, arr, 0);
    return res;
}

function tryTilesHorizontal(gameState: GameState, permutations: ITile[][], x: number, y: number): ICandidateMove[] {
    const board: IBoard = gameState.game.board;
    
    // let candidateTiles: IDroppedTile[] = [];
    let candidateMoves = []

    const permuatationsLength = permutations.length;
    for (let permutationIndex = 0; permutationIndex < permuatationsLength; permutationIndex++) {        
        const currentPermutation = permutations[permutationIndex];

        const currentPermutationLength = currentPermutation.length;
        console.log("currentPermutation:", JSON.parse(JSON.stringify(currentPermutation)));
        const candidateTiles: IDroppedTile[] = [];
        let xShift = 1;

        for (let permutationTileIndex = 0; permutationTileIndex < currentPermutationLength; permutationTileIndex++) {
            // if first or if 
            if (permutationTileIndex == 0) {
                const tile = currentPermutation[permutationTileIndex];
                candidateTiles.push({ tile, x, y });
                console.log("candidateTiles {permutationTileIndex: 0} -- ", JSON.parse(JSON.stringify(candidateTiles)));
            } else {
                let keepChecking = true
                if (!board[x + xShift]?.[y]) {
                    keepChecking = false;
                    permutationTileIndex =+ currentPermutationLength
                }
                while (keepChecking) {
                    // check if square is available
                    if (board[x + xShift]?.[y]?.tile) {
                        xShift++;
                    // } else if (board[x + xShift]?.[y]?.hasDropzone) {
                    } else if (board[x + xShift]?.[y]) {
                        const tile = currentPermutation[permutationTileIndex];
                        candidateTiles.push({ tile, x: x + xShift, y });
                        keepChecking = false;
                        xShift++;
                    } else {
                        permutationTileIndex =+ currentPermutationLength
                        keepChecking = false;                        
                    }
                }
                console.log("candidateTiles { permutationTileIndex: 1+ } -- ", JSON.parse(JSON.stringify(candidateTiles))); 
            }
        }

        const candidateTurn = {
            direction: candidateTiles.length === 1 ? Direction.Undecided : Direction.Horizontal,
            turnStatus: candidateTiles.length === 1 ? TurnStatus.OnePlaced : TurnStatus.MultiPlaced,
            droppedTiles: candidateTiles,
            firstTurnOfRound: false // blarg
        };

        console.log("candidateTurn:", JSON.parse(JSON.stringify(candidateTurn)));
        // get score
        gameState.updateComputerCandidateTurn(candidateTurn);
        console.log("gameState.game.computerCandidateTurn:", JSON.parse(JSON.stringify(gameState.game.computerCandidateTurn)));
        const score = sumTotalScore(gameState);

        candidateMoves.push ({
            score,
            candidateMove: gameState.game.computerCandidateTurn
        });

        // reset
        gameState.resetComputerCandidateTurn();  // needed?
        // candidateTiles = [];
    }

    return candidateMoves;
}

function findSelectedPlay(candidateMoves: ICandidateMove[]): ICandidateMove {
    console.log("candidateMoves:", JSON.parse(JSON.stringify(candidateMoves)));
    return candidateMoves.reduce((prev, current) => {
        return prev.score > current.score ? prev : current;
    });
}

export function getComputerTurn(gameState: GameState, playerState: PlayerState): IComputerTurn  {
    let candidateMoves: ICandidateMove[] = [];
    
    // get board
    const { board }: { board: IBoard } = gameState.game;

    // get computer as player 
    // TODO: do we need?
    const computerPlayer: IPlayer = playerState.player[Players.Bottom]; // TODO: needs to be dynamic
    
    // get computer's tiles
    const computerTiles: ITile[] = playerState.getTiles(Players.Bottom); // TODO: needs to be dynamic

    const combinations = get(computerTiles);
    const permutations: ITile[][] = [];
    combinations.forEach(combination => {
        const permuted = permute(combination);
        permutations.push(...permuted);
    });
    console.log("permutations:", JSON.parse(JSON.stringify(permutations)));

    // loop through board try each tile
    const numberOfColumns = board.length;
    for (let x = 0; x < numberOfColumns; x++) {
        const numberOfRows = board[x].length;
        for (let y = 0; y < numberOfRows; y++) {
            // only look at dropzone "available" squares
            if (board[x][y].hasDropzone) {
                console.log("hasDropzone at:", x, y);
                candidateMoves = [...candidateMoves, ...tryTilesHorizontal(gameState, permutations, x, y)];
            } else {
                console.log("no hasDropzone at:", x, y);
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
    const selectedPlay = findSelectedPlay(candidateMoves);
    
    return ({
        droppedTiles: selectedPlay.candidateMove.droppedTiles,
        turnStatus: selectedPlay.candidateMove.turnStatus,
        direction: selectedPlay.candidateMove.direction
    })
}