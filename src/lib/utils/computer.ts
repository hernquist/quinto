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

/**
 * Generates all possible combinations (subsets) of computer tiles.
 * Returns all non-empty subsets of the input tiles array.
 * 
 * @param tiles - Array of computer tiles to generate combinations from
 * @returns Array of all possible tile combinations, where each combination is an array of ITile
 * 
 * @example
 * // For tiles [A, B, C], returns:
 * // [[A], [B], [C], [A, B], [A, C], [B, C], [A, B, C]]
 */


export function getAllTileCombinations(tiles: ITile[]): ITile[][] {
    let combinations: ITile[][] = [];
    // const setC = new Set()
    let setC = {}
    let x: any;

    function generateCombinations(current: ITile[], remaining: ITile[], startIndex: number) {
        // Add current combination if it's not empty
        if (current.length > 0) {
            // combinations.push([...current]);
            let combinationString = "";
            for (const tile of current) {
                combinationString += tile.text;
            }

            console.log("s", combinationString, JSON.parse(JSON.stringify(current)));
            setC[combinationString] = JSON.parse(JSON.stringify(current));
        }
        
        x = Object.values(setC);   
        combinations = Object.values(setC);   
        console.log("combinations:");
        console.log(combinations);
        console.log("x");
        console.log(x);

        // Generate combinations by including/excluding each remaining tile
        for (let i = startIndex; i < remaining.length; i++) {
            current.push(remaining[i]);
            generateCombinations(current, remaining, i + 1);
            current.pop(); // Backtrack
        }
    }

    generateCombinations([], tiles, 0);
    console.log("setC", setC);

    // log combinations
    let combinationStrings = "";
    const combinationTotal = combinations.length;
    let combinationCount = 0;
    for (const combination of combinations) {
        combinationCount++;
        let combinationString = "";
        for (const tile of combination) {
            combinationString += tile.text;
        }
        combinationStrings += `(${combinationCount})-${combinationString}   `;
    }
    console.log("[computer].getAllTileCombinations-total", combinationTotal);
    console.log("[computer].getAllTileCombinations-combinations");
    console.log(combinationStrings);

    // return combination 
    return combinations;
}

/**
 * Sorts tiles by their value property.
 * 
 * @param tiles - Array of tiles to sort
 * @param ascending - If true, sorts from lowest to highest value (default: true)
 * @returns A new array of tiles sorted by value
 * 
 * @example
 * const tiles = [{ id: 1, text: 5, value: 10 }, { id: 2, text: 3, value: 5 }];
 * const sorted = sortTiles(tiles); // [{ id: 2, text: 3, value: 5 }, { id: 1, text: 5, value: 10 }]
 */
export function sortTiles(tiles: ITile[], ascending: boolean = true): ITile[] {
    return [...tiles].sort((a, b) => {
        return ascending ? a.value - b.value : b.value - a.value;
    });
}

function swap(arr: ITile[], i: number, j: number): void {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

// Function to find the possible permutations.
// Initial value of idx is 0.
function permutations(res: ITile[][], arr: ITile[], idx: number): void {
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
function permute(arr: ITile[]): ITile[][] {
    const res: ITile[][] = [];
    permutations(res, arr, 0);
    return res;
}

function tryTilesHorizontal(gameState: GameState, permutations: ITile[][], x: number, y: number, direction: number): ICandidateMove[] {
    const board: IBoard = gameState.game.board;
    let candidateMoves = []
    const permuatationsLength = permutations.length;
    
    for (let permutationIndex = 0; permutationIndex < permuatationsLength; permutationIndex++) {        
        const currentPermutation = permutations[permutationIndex];

        const currentPermutationLength = currentPermutation.length;
        // console.log("currentPermutation:", JSON.parse(JSON.stringify(currentPermutation)));
        const candidateTiles: IDroppedTile[] = [];
        let xShift = 1;

        for (let permutationTileIndex = 0; permutationTileIndex < currentPermutationLength; permutationTileIndex++) {
            // if first tile being laid 
            if (permutationTileIndex == 0) {
                const tile = currentPermutation[permutationTileIndex];
                candidateTiles.push({ tile, x, y });
                // console.log("candidateTiles {permutationTileIndex: 0} -- ", JSON.parse(JSON.stringify(candidateTiles)));
            } else {
                let keepChecking = true
                if (!board[x + (direction * xShift)]?.[y]) {
                    keepChecking = false;
                    permutationTileIndex =+ currentPermutationLength
                    // go back and check in the other direction??
                }
                while (keepChecking) {
                    // check if square is available
                    if (board[x + (direction * xShift)]?.[y]?.tile) {
                        xShift++;
                    } else if (board[x + (direction * xShift)]?.[y]) {
                        const tile = currentPermutation[permutationTileIndex];
                        candidateTiles.push({ tile, x: x + (direction * xShift), y });
                        keepChecking = false;
                        xShift++;
                    } else {
                        permutationTileIndex =+ currentPermutationLength
                        keepChecking = false;  
                          // go back and check in the other direction??                      
                    }
                }
                // console.log("candidateTiles { permutationTileIndex: 1+ } -- ", JSON.parse(JSON.stringify(candidateTiles))); 
            }
        }

        const candidateTurn = {
            direction: candidateTiles.length === 1 ? Direction.Undecided : Direction.Horizontal,
            turnStatus: candidateTiles.length === 1 ? TurnStatus.OnePlaced : TurnStatus.MultiPlaced,
            droppedTiles: candidateTiles,
            firstTurnOfRound: false // blarg
        };

        // console.log("candidateTurn:", JSON.parse(JSON.stringify(candidateTurn)));
        // get score
        gameState.updateComputerCandidateTurn(candidateTurn);
        // console.log("gameState.game.computerCandidateTurn:", JSON.parse(JSON.stringify(gameState.game.computerCandidateTurn)));
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

function tryTilesVertical(gameState: GameState, permutations: ITile[][], x: number, y: number, direction: number): ICandidateMove[] {
    const board: IBoard = gameState.game.board;
    let candidateMoves = []
    const permuatationsLength = permutations.length;
    
    for (let permutationIndex = 0; permutationIndex < permuatationsLength; permutationIndex++) {        
        const currentPermutation = permutations[permutationIndex];

        const currentPermutationLength = currentPermutation.length;
        // console.log("currentPermutation:", JSON.parse(JSON.stringify(currentPermutation)));
        const candidateTiles: IDroppedTile[] = [];
        let yShift = 1;

        for (let permutationTileIndex = 0; permutationTileIndex < currentPermutationLength; permutationTileIndex++) {
            // if first tile being laid 
            if (permutationTileIndex == 0) {
                const tile = currentPermutation[permutationTileIndex];
                candidateTiles.push({ tile, x, y });
                // console.log("candidateTiles {permutationTileIndex: 0} -- ", JSON.parse(JSON.stringify(candidateTiles)));
            } else {
                let keepChecking = true
                if (!board[x]?.[y + (direction * yShift)]) {
                    keepChecking = false;
                    permutationTileIndex =+ currentPermutationLength
                    // go back and check in the other direction??
                }
                while (keepChecking) {
                    // check if square is available
                    if (board[x]?.[y + (direction * yShift) ]?.tile) {
                        yShift++;
                    } else if (board[x]?.[y + (direction * yShift)]) {
                        const tile = currentPermutation[permutationTileIndex];
                        candidateTiles.push({ tile, x, y: y + (direction * yShift) });
                        keepChecking = false;
                        yShift++;
                    } else {
                        permutationTileIndex =+ currentPermutationLength
                        keepChecking = false;  
                          // go back and check in the other direction??                      
                    }
                }
                // console.log("candidateTiles { permutationTileIndex: 1+ } -- ", JSON.parse(JSON.stringify(candidateTiles))); 
            }
        }

        const candidateTurn = {
            direction: candidateTiles.length === 1 ? Direction.Undecided : Direction.Vertical,
            turnStatus: candidateTiles.length === 1 ? TurnStatus.OnePlaced : TurnStatus.MultiPlaced,
            droppedTiles: candidateTiles,
            firstTurnOfRound: false // blarg
        };

        // console.log("candidateTurn:", JSON.parse(JSON.stringify(candidateTurn)));
        // get score
        gameState.updateComputerCandidateTurn(candidateTurn);
        // console.log("gameState.game.computerCandidateTurn:", JSON.parse(JSON.stringify(gameState.game.computerCandidateTurn)));
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
    return candidateMoves.reduce((prev, current) => {
        return prev.score > current.score ? prev : current;
    });
}

export function getComputerTurn(gameState: GameState, playerState: PlayerState): IComputerTurn  {
    let candidateMoves: ICandidateMove[] = [];
    const playLevel = gameState.game.playLevel;
    
    // get board
    const { board }: { board: IBoard } = gameState.game;

    // get computer's tiles 
    // it assumes the computer is on the bottom 
    const computerTiles: ITile[] = playerState.getTiles(Players.Bottom); // TODO: needs to be dynamic

    console.log("[computer].getComputerTurn-computerTiles", JSON.parse(JSON.stringify(computerTiles)));
    
    const sortedTiles = sortTiles(computerTiles);
    
    console.log("[computer].getComputerTurn-sortedTiles", JSON.parse(JSON.stringify(sortedTiles)));
    
    const combinations = getAllTileCombinations(sortedTiles);
    console.log("[computer].getComputerTurn-combinations", JSON.parse(JSON.stringify(combinations)));
    const permutations: ITile[][] = [];
    combinations.forEach(combination => {
        const permuted = permute(combination);
        permutations.push(...permuted);
    });
    console.log("[computer].getComputerTurn - permutations", JSON.parse(JSON.stringify(permutations)));

    // loop through board try each tile
    const numberOfColumns = board.length;
    for (let x = 0; x < numberOfColumns; x++) {
        const numberOfRows = board[x].length;
        for (let y = 0; y < numberOfRows; y++) {
            // only look at dropzone "available" squares
            if (board[x][y].hasDropzone) {
                // console.log("hasDropzone at:", x, y);
                const directions = [-1, 1];
                const [left, right] =  directions;
                const [up, down] =  directions;
                candidateMoves = [
                    ...candidateMoves, 
                    ...tryTilesHorizontal(gameState, permutations, x, y, right), 
                    ...tryTilesHorizontal(gameState, permutations, x, y, left),
                    ...tryTilesVertical(gameState, permutations, x, y, up),
                    ...tryTilesVertical(gameState, permutations, x, y, down),
                ];
            } else {
                // console.log("no hasDropzone at:", x, y);
            }
        }
    }
    // console.log("number of candidate moves:", candidateMoves.length);
    const sortedCandidateMoves = candidateMoves.sort((a, b) => b.score - a.score);
    const numberOfCandidateMoves = sortedCandidateMoves.length;
    // console.log("number of candidate moves sorted:", numberOfCandidateMoves);
    
    const slicer = (5 - playLevel) * 0.1;
    // console.log("slicer:", slicer);
    const percentOfRemovedMoves = Math.floor(numberOfCandidateMoves * slicer);
    // console.log("percentOfRemovedMoves:", percentOfRemovedMoves);
    const selectedCandidateMoves = sortedCandidateMoves.slice(0, numberOfCandidateMoves - percentOfRemovedMoves);
    // console.log("selectedCandidateMoves.length:", selectedCandidateMoves.length);
    // console.log("selectedCandidateMoves:", selectedCandidateMoves);
    const selectedPlay = findSelectedPlay(selectedCandidateMoves);

    return ({
        droppedTiles: selectedPlay.candidateMove.droppedTiles,
        turnStatus: selectedPlay.candidateMove.turnStatus,
        direction: selectedPlay.candidateMove.direction
    })
}