<script lang="ts">
    import { getGameState } from "../../state/game.svelte";
	import generateGameTiles from "./utils/generateGameTiles";
	import initializePlayers from "./utils/initializePlayers";
	import initializeBoard from "./utils/initializeBoard";
    import { getPlayerState } from "$lib/state/player.svelte";
	import { Players } from "$lib/state/types";

    const ROWS = 3;
    const COLUMNS = 8;

    const  { children } = $props();
    const { Top, Bottom } = Players;

    const gameState = getGameState();
    
    // initialize board
    gameState.updateBoardDimensions(ROWS, COLUMNS);
    // initialize game tiles
    generateGameTiles();
    // initialize player and produce initialze player tiles
    const { topPlayerTiles, bottomPlayerTiles } = initializePlayers();
    // update player tiles
    const playerTileState = getPlayerState();
    playerTileState.updateTiles(Top, topPlayerTiles);
    playerTileState.updateTiles(Bottom, bottomPlayerTiles)
    // finish initializing board
    initializeBoard();
    gameState.setStartingSquare();
    // update board after setStartingSquare since it affects 
    gameState.updateBoardAfterTileDrop();
</script>

{@render children()}