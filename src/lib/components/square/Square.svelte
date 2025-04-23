<script lang="ts">
	import type { ICoordTuple, ISquare, ITile, ITiles } from "../game/types";
    import { dropzone } from "../../utils/dnd";
	import { getPlayerState } from "$lib/state/player.svelte";
	import { getGameState } from "$lib/state/game.svelte";
	import { DropzoneStatus, type Players } from "$lib/state/types";
	import Tile from "../tile/Tile.svelte";

    interface ISquareProps {
        square: ISquare, 
        x: number, 
        y: number, 
        activePlayer: Players
        dropzoneAllowlist: ICoordTuple[] | DropzoneStatus;
    }
    const gameState = getGameState();

    let { square, x, y, activePlayer, dropzoneAllowlist }: ISquareProps = $props();
    const { tile, startingSquare, id, hasDropzoneeeee } = $derived(square);

    const playerTileState = getPlayerState();
    let tiles: ITiles = $derived(playerTileState.tiles[activePlayer]);

    let status = $derived(gameState.game.turn.turnStatus);

    function hasDropzone() {
        if (dropzoneAllowlist === DropzoneStatus.Complete) {
            return dropzone;
        }
        const isAllowed = dropzoneAllowlist.reduce((acc, curr) => {
            const [xAllowed, yAllowed] = curr;
            if (xAllowed===x && yAllowed === y) {
                acc = true;
            }
            return acc;
        }, false);
        return isAllowed ? dropzone : () => {};
    }

    $inspect(
        console.log("gameState.game.turn.turnStatus", status)
    )

    const onDropzone = (tileId: number): void => {
        const foundTile: ITile | undefined = tiles.find(tile => tile.id == tileId);
        // put in logic to allow only legal moves
        if (foundTile) {
            gameState.updateBoardSquareWithTile(x, y, foundTile);
            gameState.updateTurn(x, y, foundTile)
            playerTileState.removeTile(activePlayer, tileId);   
        }
}
</script>

{#if tile}
    <div 
        class="board__square" 
        id={String(id)} 
    >
        <Tile tile={tile} isActive />
    </div>
{:else if hasDropzoneeeee}
    <div 
        class="board__square"
        class:startingSquare
        id={String(id)} 
        use:dropzone={{
            on_dropzone: onDropzone, 
        }}
    ></div>
{:else}
    <div 
        class="board__square"
        class:startingSquare
        id={String(id)} 
    ></div>
{/if}

<style>
    .board__square {
        width: 60px;
        height: 60px;
        background-color: lightsalmon;
        border: 2px solid gray;
        border-radius: 1px;
        margin: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .startingSquare {
        border: 6px dashed lightgrey;
        background-color: salmon;
    }
</style>