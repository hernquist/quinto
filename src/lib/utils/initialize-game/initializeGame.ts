import type { GameState } from "$lib/state/game/game.svelte";
import initState from "$lib/state/game/gameInitialState";
import { asyncWhileLoop } from "$lib/state/game/gameUtils";
import type { PlayerState } from "$lib/state/player/player.svelte";
import { Players } from "$lib/state/player/types";
import type { ToastState } from "$lib/state/toast/toast.svelte";
import generateGameTiles from "./generateGameTiles";
import initializeBoard from "./initializeBoard";
import initializePlayers from "./initializePlayers";

const { Top, Bottom } = Players;

export function initializeGame(gameState: GameState, playerState: PlayerState, toastState: ToastState, options = {}) {
    if (gameState.isInitialized) {
        console.log("aborting initializeGame -- already initialized...");
        return;
    } else {
        gameState.setInitializeGameTrue();
    }

    let defaults = {
        rows: initState.rows,
        columns: initState.columns,
        gameMultiple: 5, // default game multiple
        playLevel: 5 // default play level
    };
    const args = Object.assign({}, defaults, options);

    // initialize board
    gameState.reInitializeGame();
    gameState.updateBoardDimensions(args);
    gameState.updateGameMultiple(args.gameMultiple);
    gameState.updatePlayLevel(args.playLevel);
    // initialize game tiles
    generateGameTiles(gameState);
    // initialize player and produce initialze player tiles
    const { topPlayerTiles, bottomPlayerTiles } = initializePlayers(playerState, gameState);

    playerState.updateTiles(Top, topPlayerTiles);
    playerState.updateTiles(Bottom, bottomPlayerTiles)
    // finish initializing board
    initializeBoard(gameState);
    gameState.setStartingSquare();
    // update board after setStartingSquare since it affects
    // gameState.updateBoardAfterTileDrop();
    // make a copy of the board before game play starts
    gameState.captureBoard();
    console.log("[initializeGame] gameState.game:", JSON.parse(JSON.stringify(gameState.game)));
    if (playerState.player[gameState.game.activePlayer].isComputer) {
        setTimeout(async () => {
            await asyncWhileLoop(gameState, playerState, toastState);
        }, 400);
    }
}