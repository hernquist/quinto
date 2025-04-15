<script lang="ts">
    import { gameState } from "../../../state/state.svelte";
	import generateGameTiles from "./utils/generateGameTiles";
	import initializePlayers from "./utils/initializePlayers";
	import initializeBoard from "./utils/initializeBoard";

    const ROWS = 7;
    const COLUMNS = 6;

    // initialize
    gameState.rows = ROWS;
    gameState.columns = COLUMNS;
    gameState.totalSquares = ROWS * COLUMNS;
    generateGameTiles();
    initializePlayers();
    initializeBoard();
</script>

<slot />