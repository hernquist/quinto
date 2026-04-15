<script lang="ts">
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
	import { ModalScreen } from "$lib/state/modal-state/types";
    
    const modalState = getModalState();
    const { Settings, GameOver, HighScores, About} = ModalScreen
</script>

<div class="header">
    <button
        class:active={modalState.screen.name === GameOver} 
        onclick={()=> modalState.changeScreen(GameOver)}
    >
        Game Over 
    </button>
    <button 
        class:active={modalState.screen.name === Settings} 
        onclick={()=> modalState.changeScreen(Settings)}
    >
        Settings
    </button>
    <button 
        class:active={modalState.screen.name === HighScores} 
        onclick={()=> modalState.changeScreen(HighScores)}
    >
        High Scores
    </button>
    <button
        class:active={modalState.screen.name === About} 
        onclick={()=> modalState.changeScreen(About)}
    >
        About 
    </button>
</div>

<style>
  /* Style the header with a grey background and some padding */
  .header {
    overflow: hidden;
    background-color: var(--color-modal-header-bg);
    border: 2px solid var(--color-modal-header-border);
    border-radius: 4px;
    margin: 0px;
    display: flex;
    flex-wrap: nowrap;
  }

  /* Style the header links */
  .header button {
    float: left;
    color: var(--color-text);
    text-align: center;
    font-size: 12px;
    line-height: 16px;
    padding: 10px;
    text-decoration: none;
    border-right: var(--color-modal-header-border) 2px solid;
    background-color: var(--color-modal-tab);

    &:last-child {
      border-right: none; 
    }

    @media screen and (min-width: 360px) {
      font-size: 14px;
      line-height: 18px;
    }

    @media screen and (min-width: 500px) {
        font-size: 18px;
        line-height: 25px;
    }
  }

  /* Change the background color on mouse-over */
  .header button:hover {
    background-color: var(--color-modal-tab-hover);
    color: var(--color-text);
  }

  /* Style the active/current link*/
  .header button.active {
    background-color: var(--color-modal-tab-active);
    color: var(--color-text);
  }
</style>