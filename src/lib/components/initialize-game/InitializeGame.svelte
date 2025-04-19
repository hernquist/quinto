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
    const { Top, Bottom } = Players;

    // initialize
    updateBoardDimensions(ROWS, COLUMNS);
    generateGameTiles();
    const { topPlayerTiles, bottomPlayerTiles } = initializePlayers();

    const playerTileState = getPlayerTilesState();
    
    // updatePlayerTiles(Players.Top, topPlayerTiles);
    playerTileState.update(Top, topPlayerTiles);
    playerTileState.update(Bottom, bottomPlayerTiles)
    
    initializeBoard();
</script>

{@render children()}