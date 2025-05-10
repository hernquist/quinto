<script lang="ts">
    import { getGameState } from "$lib/state/game/game.svelte";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getToastState } from "$lib/state/toast/toast.svelte";
	import Page from "../../../routes/+page.svelte";
	import { initializeGame } from "../initialize-game/utils/initializeGame";
	import { UpdateText } from "./types";

    let gameState = getGameState();
    let playerState = getPlayerState();
    let modalState = getModalState();
    let toastState = getToastState();

    let rowsAndColumnsUpdateText = $state<UpdateText>(UpdateText.Update);

    // not needed
    // function handleClick(e: Event) {
    //     e.preventDefault();
    //     console.log("click", rowsAndColumnsUpdateText)
    //     switch(rowsAndColumnsUpdateText) {
    //         case UpdateText.Update: 
    //             rowsAndColumnsUpdateText = UpdateText.Save;
    //             break;
    //         case UpdateText.Save:
    //             rowsAndColumnsUpdateText = UpdateText.Update;
    //             break;

    //     }
    // }

    let rows = $state(gameState.game.rows);
	let columns = $state(gameState.game.columns);

    function onSave() {
        initializeGame(gameState, playerState, { rows, columns });
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