<script lang="ts">
	import ViewListIcon from "$lib/components/icons/ViewListIcon.svelte";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";

    const modalState = getModalState()

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        modalState.toggleModalOn();
    };
</script>

<button class="view-list" on:click={handleClick} >
    <ViewListIcon  />
</button>

<style>
    .view-list {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        cursor: pointer;
    }

    .view-list:hover {
        opacity: 0.8;
    }

    .view-list:active {
        opacity: 0.6;
    }
</style>