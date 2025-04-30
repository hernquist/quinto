<script lang="ts">
	import { getModalState } from "$lib/state/modal/modal.svelte";
	import { ModalScreen } from "$lib/state/modal/types";
    
    const modalState = getModalState();
    const { Settings, GameOver, HighScores, About} = ModalScreen
    
</script>

<div>
    {#if modalState.screen.name === Settings} 
        <div>settings</div>
        
    {:else if modalState.screen.name === GameOver}
        <div>game over</div>

    {:else if modalState.screen.name === HighScores}
        <div>high score</div>

    {:else if modalState.screen.name === About}
        <div>about</div>
    
    {/if}
</div>