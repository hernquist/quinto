import { getGameState, updateTiles } from "../../../state/state.svelte";

function generateGameTiles( ){
    const { totalSquares } = getGameState();
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
    updateTiles(gameTiles);
} 

export default generateGameTiles;