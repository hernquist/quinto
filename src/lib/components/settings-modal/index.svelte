<script lang="ts">
    import { getGameState } from "$lib/state/game/game.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getToastState } from "$lib/state/toast/toast.svelte";
	import { initializeGame } from "../initialize-game/utils/initializeGame";
    import { isMediumSmall, isMediumLarge, isLarge } from "$lib/utils/mediaQuery"
	import { boards, ScreenSizes, Sizes, type IBoardDimensions } from "$lib/constants/boards";
    import { textLevelTuple } from "$lib/utils/textual";

    let gameState = getGameState();
    let playerState = getPlayerState();
    let toastState = getToastState();

    let gameMultiple = $state(gameState.game.gameMultiple);
    let playLevel = $state(gameState.game.playLevel);
    let boardType = $state(gameState.game.boardType); 
    
    const { Small, MediumSmall, MediumLarge, Large } = ScreenSizes;
    let allowedBoards: IBoardDimensions[] = $state([]); 

    function onSave(e: MouseEvent): void {
        e.preventDefault();

        const options = {
            boardType,
            rows: boards[boardType].rows,
            columns: boards[boardType].columns,
            gameMultiple,
            playLevel
        };
        initializeGame(gameState, playerState, toastState, options);
    }

    function setAllowedBoards() {
        const containsSmall = true;
        let containsMediumSmall = false;
        let containsMediumLarge = false;
        let containsLarge = false;

        if (isLarge()) {
            containsLarge = true;
            containsMediumLarge = true;
            containsMediumSmall = true;
        } else if (isMediumLarge()) {
            containsMediumLarge = true;
            containsMediumSmall = true;
        } else if (isMediumSmall()) {
            containsMediumSmall = true;
        };
        const boardTypes = Object.keys(boards) as Sizes[];

        let allBoards = [];

        for (let boardType of boardTypes) {
            const board = boards[boardType];
            let pushBoard = false;

            if (board.maxScreenSize === Small && containsSmall) pushBoard = true;
            if (board.maxScreenSize === MediumSmall && containsMediumSmall) pushBoard = true;
            if (board.maxScreenSize === MediumLarge && containsMediumLarge) pushBoard = true;
            if (board.maxScreenSize === Large && containsLarge) pushBoard = true;

            if (pushBoard) {
                allBoards.push({ ...board, boardType });
            }
        }

        return allBoards
    } 

    $effect(() => {
        allowedBoards = setAllowedBoards();
    })
</script>

<div class="settings-modal__body-container">
    <div>BOARDS</div>
    <div class="options__container">
        {#each allowedBoards as allowedBoard}
            <button 
                onclick={() => { if (allowedBoard.boardType !== undefined) boardType = allowedBoard.boardType; }} 
                class="options__button {boardType === allowedBoard.boardType ? 'selected' : ''}">
                {allowedBoard.rows}x{allowedBoard.columns}
            </button>
        {/each}
    </div>

    <div>GAME MULTIPLE</div>
    <div class="options__container">
        {#each [3,4,5,6,7,8,9,10] as multiple}
            <button 
                onclick={() => gameMultiple = multiple} 
                class="options__button {gameMultiple === multiple ? 'selected' : ''}">
                {multiple}
            </button>
        {/each}
    </div>

    <div>PLAY LEVEL</div>
    <div class="options__container">
        {#each [1,2,3,4,5] as level}
            <button 
                onclick={() => playLevel = level} 
                class="options__button {playLevel === level ? 'selected' : ''}">
                {textLevelTuple[level-1]}
            </button>
        {/each}
    </div>

    <button formaction="?/createNewGame" class="settings-modal__button" onclick={onSave}> SAVE </button>
</div>

<style>
    .settings-modal__body-container {
        margin: 10px 0 0 0;
    }

    .options__container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: start;
        align-items: center;
        margin: 4px 0 6px;
        gap: 6px;
    }

    .options__button {
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        font-weight: 700;
        font-size: 14px;
        line-height: 14px;
        padding: 1px 2px;
        border: 1px solid black;
        border-radius: 2px;
        background-color: tan;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .options__button.selected {
        background-color: lightblue;
        font-weight: 900;
    }

    .settings-modal__button {
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        font-weight: 700;
        font-size: 16px;
        line-height: 16px;
        padding: 6px 12px;
        border: 1px solid black;
        border-radius: 2px;
        background-color: tan;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        margin: 20px 0 10px;
        float: right;
    }
</style>
