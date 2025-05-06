import type { GameState } from "$lib/state/game/game.svelte";
import type { PlayerState } from "$lib/state/player/player.svelte";
import { Players } from "$lib/state/player/types";
import generateGameTiles from "./generateGameTiles";
import initializeBoard from "./initializeBoard";
import initializePlayers from "./initializePlayers";

const ROWS = 4;
const COLUMNS = 4;

const { Top, Bottom } = Players;

export function initializeGame(gameState: GameState, playerTileState: PlayerState) {
    // initialize board
    gameState.updateBoardDimensions(ROWS, COLUMNS);
    // initialize game tiles
    generateGameTiles(gameState);
    // initialize player and produce initialze player tiles
    const { topPlayerTiles, bottomPlayerTiles } = initializePlayers(playerTileState, gameState);

    playerTileState.updateTiles(Top, topPlayerTiles);
    playerTileState.updateTiles(Bottom, bottomPlayerTiles)
    // finish initializing board
    initializeBoard(gameState);
    gameState.setStartingSquare();
    // update board after setStartingSquare since it affects 
    gameState.updateBoardAfterTileDrop();
    // make a copy of the board before game play starts
    gameState.captureBoard();
}