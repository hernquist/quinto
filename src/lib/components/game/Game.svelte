<script lang="ts">
	import InitializeGame from "../initialize-game/InitializeGame.svelte";
	import { getGameState } from "$lib/state/game/game.svelte";
	import { getToastState, MAIN_TOAST_DURATION, HIGHLIGHT_DURATION } from "$lib/state/toast/toast.svelte";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
    import { Players } from "$lib/state/player/types";
	import Modal from "$lib/components/modal/modal.svelte";
	import MainModalWrapper from "$lib/components/main-modal-wrapper/MainModalWrapper.svelte";
	import ModalHeader from "$lib/components/modal-header/ModalHeader.svelte";
	import { ModalScreen } from "$lib/state/modal-state/types";
    import { GameStatus } from "$lib/state/game/types";
	import MenuBar from "../menu-bar/MenuBar.svelte";
	import GamePlay from "../game-play/GamePlay.svelte";
	import { makePutRequest } from "$lib/utils/api";
	import { updateScore } from "./updateGame.remote";
    
    const gameState = getGameState();
    const modalState = getModalState();
    const toastState = getToastState();
    const playerState = getPlayerState();
    const { numberOfLines } = $derived(toastState);

    const { gameId } = $props();
    const { Top, Bottom } = Players; 

    // Is this even the right way of doing it?
    // see below
    let fire = $state(true);

    // This is needs more testing and thinking. That calculation should happen out of here probably.
    $effect(() => {
        if (gameState.game.status === GameStatus.Complete) {
            if (fire) {
                updateScore({
                    gameId, 
                    top_score: playerState.player[Top].score,
                    bottom_score: playerState.player[Bottom].score
                });
                fire = false
            }
            setTimeout(()=> {
                modalState.changeScreen(ModalScreen.GameOver);
                modalState.toggleModalOn();
            }, numberOfLines * HIGHLIGHT_DURATION + 1 * MAIN_TOAST_DURATION);
        }
	});
</script>

<InitializeGame>
    <!-- TODO: think of new way determine game status and winner -->
    <!-- {#if gameState.game.status === GameStatus.Complete}
        <pre>DONE</pre>
    {/if} -->
    <MenuBar />
    <GamePlay />
    {#if modalState.showModal === true}
        <Modal>
            {#snippet header()}
                <ModalHeader />
            {/snippet}
            <MainModalWrapper/>
        </Modal>
    {/if}
</InitializeGame>