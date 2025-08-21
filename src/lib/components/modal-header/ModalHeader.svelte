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
  background-color: #f1f1f1;
  border: 2px solid #000000;
  border-radius: 4px;
  margin: 0px;
}

/* Style the header links */
.header button {
  float: left;
  color: black;
  text-align: center;
  padding: 12px;
  text-decoration: none;
  font-size: 18px;
  line-height: 25px;
  border-right:#000000 2px solid;
  background-color: tan;

  &:last-child {
    border-right: none; 
  }
}

/* Change the background color on mouse-over */
.header button:hover {
  background-color: #ddd;
  color: black;
}

/* Style the active/current link*/
.header button.active {
  background-color: #ADD8E6;
  color: black;
}

/* Add media queries for responsiveness - when the screen is 500px wide or less, stack the links on top of each other */
@media screen and (max-width: 500px) {
  .header button {
    float: none;
    display: block;
    text-align: left;
  }
}

</style>