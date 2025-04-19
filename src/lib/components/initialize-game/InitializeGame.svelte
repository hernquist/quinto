<script lang="ts">
    import { getGameState } from "../../state/state.svelte";
	import generateGameTiles from "./utils/generateGameTiles";
	import initializePlayers from "./utils/initializePlayers";
	import initializeBoard from "./utils/initializeBoard";
    import { getPlayerTilesState } from "$lib/state/player.svelte";
	import { Players } from "$lib/state/types";

    const ROWS = 7;
    const COLUMNS = 6;

    const  { children } = $props();
    const { Top, Bottom } = Players;

    // initialize
    const gameState = getGameState();

    gameState.updateBoardDimensions(ROWS, COLUMNS);
    generateGameTiles();

    // TODO: update initialize players
    const { topPlayerTiles, bottomPlayerTiles } = initializePlayers();

    // player tiles
    const playerTileState = getPlayerTilesState();
    playerTileState.update(Top, topPlayerTiles);
    playerTileState.update(Bottom, bottomPlayerTiles)
    
    initializeBoard();
</script>

{@render children()}