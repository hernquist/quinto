<script>
	import NumberOfTiles from "./NumberOfTiles.svelte";
</script>

<div class="tiles">
    <div class="tiles-text">TILES</div>
    <NumberOfTiles />
</div>

<style>
    /* same as ViewList class */
    .tiles {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        
        width: 92px;
        cursor: pointer;
        height: calc(100% - 4px);

    }

    .tiles-text {
        display: flex  ;
        flex-grow: 1;

        align-items: center;
        justify-content: center;
        height: 50%;
    }
</style>