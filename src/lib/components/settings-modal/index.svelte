<script lang="ts">
    import { getGameState } from "$lib/state/game/game.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getToastState, ToastState } from "$lib/state/toast/toast.svelte";
	import { initializeGame } from "../initialize-game/utils/initializeGame";

    let gameState = getGameState();
    let playerState = getPlayerState();
    let toastState = getToastState();

    let rows = $state(gameState.game.rows);
	let columns = $state(gameState.game.columns);

    function onSave(e) {
        e.preventDefault();
        initializeGame(gameState, playerState, toastState, { rows, columns });
    }
</script>

<div >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div>
        UPDATE ROWS AND COLUMNS 
        <!-- <button onclick={handleClick}>{rowsAndColumnsUpdateText}</button> -->
    </div>
    <div>
        rows {rows} <input type="range" bind:value={rows} min="4" max="10" />
    </div>
    <div>
        columns {columns} <input type="range" bind:value={columns} min="4" max="10" />
    </div>

    <button onclick={onSave}> SAVE </button>
</div>