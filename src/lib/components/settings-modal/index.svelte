<script lang="ts">
	import { boards, type IBoardDimensions, Sizes } from "$lib/constants/boards";
    import { textLevelTuple } from "$lib/utils/textual";
	import setAllowedBoards from "./utils";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";

    let allowedBoards: IBoardDimensions[] = $state([]);
	const modalState = getModalState();

    $effect(() => {
        allowedBoards = setAllowedBoards(boards);
    })
</script>

<div class="settings-modal__body-container">
    <form method="POST" >
        <div>BOARDS</div>
        <div class="options__container">
            {#each allowedBoards as allowedBoard}
                {@const id = allowedBoard.boardType}
                <input
                    {id} 
                    type="radio"
                    name="boardType"
                    value={allowedBoard.boardType}
                    checked={allowedBoard.boardType === "5x5"}
                >
                <label for={id} class="options__button">
                    {allowedBoard.rows}x{allowedBoard.columns}
                </label>
            {/each}
        </div>

        <div>GAME MULTIPLE</div>
        <div class="options__container">
            {#each [3,4,5,6,7,8,9,10] as multiple}
                {@const id = String(multiple)+"multiple"}
                <input 
                    {id}
                    type="radio"
                    name="multiple"
                    value={multiple}
                    checked={multiple===5}
                >
                <label for={id} class="options__button">
                    {multiple}
                </label>
            {/each}
        </div>

        <div>PLAY LEVEL</div>
        <div class="options__container">
            {#each [1,2,3,4,5] as level}
                {@const skillLevel = textLevelTuple[level-1]}
                <input 
                    id={skillLevel}
                    type="radio"
                    name="skillLevel"
                    value={level}
                    checked={level===5}
                >
                <label for={skillLevel} class="options__button">
                    {skillLevel}
                </label>
            {/each}
        </div>
        <div class="settings-modal__buttons">
            <button formaction="?/createNewGame" class="settings-modal__button">SAVE</button>
            <button
                type="button"
                class="settings-modal__button"
                aria-label="Close modal"
                onclick={(e) => { e.preventDefault(); modalState.toggleModalOff(); }}
            >CLOSE</button>
        </div>
    </form>
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

    input[type="radio"]:checked + label {
        background-color: lightblue;
        font-weight: 900;
    }   

    [type='radio'] {
        display: none;
    }

    .settings-modal__buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 20px 0 10px;
        gap: 1em;
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
    }
</style>
