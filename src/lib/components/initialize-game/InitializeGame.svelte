<script lang="ts">
    import { updateBoardDimensions } from "../../state/state.svelte";
	import generateGameTiles from "./utils/generateGameTiles";
	import initializePlayers from "./utils/initializePlayers";
	import initializeBoard from "./utils/initializeBoard";

    import { getPlayerTilesState } from "$lib/state/player.svelte";
	import { Players } from "$lib/state/types";

    const ROWS = 7;
    const COLUMNS = 6;

    const  { children } = $props();

    // initialize
    updateBoardDimensions(ROWS, COLUMNS);
    generateGameTiles();
    const { topPlayerTiles } = initializePlayers();

    const playerTileState = getPlayerTilesState()
    
    // updatePlayerTiles(Players.Top, topPlayerTiles);
    playerTileState.update(topPlayerTiles)
    
    initializeBoard();
</script>

{@render children()}