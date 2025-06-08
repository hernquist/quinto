import type { IBoard, ICoordTuple } from "$lib/components/game/types";
import { ToastType } from "$lib/state/toast/types";
import type { PlayerState } from "../player/player.svelte";
import { HIGHLIGHT_DURATION, ToastState } from "../toast/toast.svelte";
import { dependentKeyMap, independentKeyMap } from "./constants";
import type { GameState } from "./game.svelte";
import { sumScores } from "./synchronousCalculateScore";
import { Axis, Direction, type IDroppedTile, type IGameState, type IIsValidPlay, type ILineItem, type ITurn } from "./types";

export function checkSurroundSquaresForASingleTile (board: IBoard, x: number, y: number): boolean {
    if (
        board?.[x + 1]?.[y]?.tile || 
        board?.[x - 1]?.[y]?.tile || 
        board?.[x]?.[y + 1]?.tile || 
        board?.[x]?.[y - 1]?.tile
    ) {
        return true;
    }
    return false;
}

export function addDropzoneOptions(length: number, firstTile: IDroppedTile, direction: Direction, dropzoneOptions: ICoordTuple[]): ICoordTuple[] {
    const { x, y } = firstTile;
    for (let i = 0; i < length; i++) {
        if (direction === Direction.Vertical) {
            // if part of dropped tiles, don't add to list
            if (y !== i) dropzoneOptions.push([x, i]);
        }
        if (direction === Direction.Horizontal) {
            // if part of dropped tiles, don't add to list
            if (x !== i) {
                dropzoneOptions.push([i, y]);
            }
        }
    }	
    return dropzoneOptions;
}

export async function readLinesForScore(lines: ILineItem[][], gameMultiple: number, toastState: ToastState): Promise<number> {
    return new Promise ((resolve) => {
        const totalLineScore = sumScores(lines, gameMultiple);
        toastState.addHighlights(lines, gameMultiple);
        setTimeout(() => { 
            resolve(totalLineScore);
            toastState.add("", `${totalLineScore}`, ToastType.TOTAL_LINE_SCORE); 
        }, lines.length * HIGHLIGHT_DURATION)
    });
}

// min max of a player's dropped tiles
export function getMinMaxTile(droppedTiles:IDroppedTile[], direction: Direction.Horizontal | Direction.Vertical, isMin = true): IDroppedTile {
    const key: Axis = independentKeyMap[direction];
    const minMaxShifter = isMin ? 1 : -1;
    return <IDroppedTile>droppedTiles.reduce((acc: IDroppedTile, curr: IDroppedTile, i: number) => 
        i === 0 || (minMaxShifter * curr[key] < minMaxShifter * acc[key]) ? curr : acc
    );
}

export function checkForContinuousTiles(min: IDroppedTile, max: IDroppedTile, game: IGameState): IIsValidPlay {
    const { board, turn: { direction, droppedTiles }}: { board: IBoard, turn: ITurn } = game;
    const key: Axis = independentKeyMap[direction];
    const dependentKey: Axis = dependentKeyMap[direction];
    let getMinToCheck = min[key] + 1;
    const getMaxToCheck = max[key] - 1;
    let noMatch = false;
    let emptySquares = [];

    while (getMaxToCheck - getMinToCheck >= 0) {
        const droppedTileMatch = droppedTiles.find((tile) => 
            tile[key] === getMinToCheck && tile[dependentKey] === min[dependentKey]
        );

        if (!droppedTileMatch) {
            let boardMatch = false;
            board.forEach(column => {
                column.forEach(square => {
                    if (square[key] === getMinToCheck && square[dependentKey] === min[dependentKey] && square.tile) {
                        boardMatch = true;
                    }
                })
            })

            if (!boardMatch) {
                noMatch = true;
                const emptySquare = {
                    [key]: getMinToCheck,
                    [dependentKey]: min[dependentKey],
                }
                emptySquares.push(emptySquare)
            }
        }    
        getMinToCheck++;
    }

    return {
        isValid: !noMatch,
        emptySquares
    }
}

export function orderTilesByDimension(tileA:IDroppedTile, tileB: IDroppedTile, key: "x" | "y"): number {
    if (tileA[key] > tileB[key]) return 1;
    if (tileA[key] < tileB[key]) return -1;
    return 0;
}

export function sleep(cb: () => void, ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(() => {cb(); resolve()}, ms));
}

export async function asyncWhileLoop(gameState: GameState, playerState: PlayerState, toastState: ToastState): Promise<void> {
        let condition = true;
        let counter = 0;

        while (condition) {
            // Asynchronous operation (e.g., fetching data)
            console.log("[FinishTurn] asyncWhileLoop game-pre", JSON.parse(JSON.stringify(gameState.game)));
            const inactivePlayer = gameState.getInactivePlayer();
            console.log("[FinishTurn] asyncWhileLoop inactivePlayer", inactivePlayer);
            const hasNoTiles = playerState.hasNoTiles(inactivePlayer);
            console.log("[FinishTurn] asyncWhileLoop hasNoTiles", hasNoTiles);
            if (!hasNoTiles) {
                condition = false
            }

            console.log("[FinishTurn] asyncWhileLoop player-pre", JSON.parse(JSON.stringify(playerState.player)));
            await gameState.computerTurn(playerState, toastState);
            // Update the condition or counter based on the result
            console.log("[FinishTurn] asyncWhileLoop iteration", counter);
            console.log("[FinishTurn] asyncWhileLoop game-post", JSON.parse(JSON.stringify(gameState.game)));
            console.log("[FinishTurn] asyncWhileLoop player-post", JSON.parse(JSON.stringify(playerState.player)));
            if (gameState.skippedTurn) {
                await gameState.finishTurn(playerState, toastState);
                console.log("[FinishTurn] asyncWhileLoop skippedTurn finishing");
            }
            if (playerState.hasNoTiles(gameState.getInactivePlayer()) && playerState.hasNoTiles(gameState.game.activePlayer)) {
                console.log("[FinishTurn] asyncWhileLoop hasNoTiles");
                condition = false;
            }
            counter++;
        }
        console.log("[FinishTurn] asyncWhileLoop completed");
        gameState.skippedTurn = false; // Reset skippedTurn after the loop
    }
