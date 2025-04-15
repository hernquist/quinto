<script lang="ts">
    import Board from "./Board.svelte";
    import Score from "./Score.svelte";
    import FinishTurn from "./FinishTurn.svelte";

    const rows = 7;
    const columns = 6;

    function generateGameTiles( ){
        const totalSquares = rows * columns;
        const numberOfTiles = Math.round(totalSquares * 0.75);
        console.log("numberOfTiles", numberOfTiles);

        let gameTiles = []

        for (let index = 0; index < numberOfTiles; index ++) {
            const value = Math.trunc(Math.random(1) * 9) + 1;
            const tile = {
                id: index,
                text: value,
                value,
            }
            gameTiles.push(tile);
        }

        console.log("gametiles", gameTiles)



    } 

    $: gameTiles = generateGameTiles();

</script>

<Score />
<Board {rows} {columns}/>
<FinishTurn />