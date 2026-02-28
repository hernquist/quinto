<script lang="ts">
    import SettingsModal from "$lib/components/settings-modal/index.svelte";
    import GameOverModal from "$lib/components/game-over-modal/index.svelte";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
	import { ModalScreen } from "$lib/state/modal-state/types";
	import HighscoresModal from "../highscores-modal/HighscoresModal.svelte";
	import AboutModal from "$lib/components/about-modal/AboutModal.svelte";
    
    const modalState = getModalState();
    const { Settings, GameOver, HighScores, About} = ModalScreen;
</script>

<div>
    {#if modalState.screen.name === Settings} 
        <SettingsModal />
        
    {:else if modalState.screen.name === GameOver}
        <GameOverModal />

    {:else if modalState.screen.name === HighScores}
        <HighscoresModal />

    {:else if modalState.screen.name === About}
        <AboutModal />
    
    {/if}
</div>