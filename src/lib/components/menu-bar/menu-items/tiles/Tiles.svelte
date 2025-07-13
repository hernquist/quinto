<script>

	import NumberOfTiles from "./NumberOfTiles.svelte";


</script>

<div class="tiles">
    <div>TILES</div>
    <NumberOfTiles />
</div>

<style>
    /* same as ViewList class */
    .tiles {
        display: flex;
        align-items: center;
        justify-content: center;
        
        width: 40px;
        cursor: pointer;

        flex-direction: column;

    }
    </style>