<script lang="ts">
    import { updateBoardDimensions } from "../../../state/state.svelte";
	import generateGameTiles from "./utils/generateGameTiles";
	import initializePlayers from "./utils/initializePlayers";
	import initializeBoard from "./utils/initializeBoard";

    const ROWS = 7;
    const COLUMNS = 6;

    // initialize
    updateBoardDimensions(ROWS, COLUMNS);
    generateGameTiles();
    initializePlayers();
    initializeBoard();
</script>

<slot />