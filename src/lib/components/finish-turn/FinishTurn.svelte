<script lang="ts">
    import { getGameState, updateActivePlayer } from "../../../state/state.svelte";
	import { Players } from "../../../state/types";
    
    // this is repeated in PlayerTiles 
    const { isActive } = $props();
    const { Top, Bottom } = Players;
    const { activePlayer } = getGameState()

    const handleClick = () => {
        if (activePlayer === Top) {
            updateActivePlayer(Bottom);
        } 
        if (activePlayer === Bottom) {
            updateActivePlayer(Top);
        }
    }
</script>


<button disabled={!isActive} onclick={handleClick}>
    Finish Turn
</button>

<style>
    button {
        color: green;
        background-color: aquamarine;
    }
</style>