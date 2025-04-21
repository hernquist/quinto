import { getGameState  } from "$lib/state/game.svelte";

function generateGameTiles(){
    const gameState = getGameState();
    const startingNumberOfSquares = gameState.game.startingNumberOfSquares;
    const numberOfTiles = Math.round(startingNumberOfSquares * 0.75);

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

    gameState.updateTiles(gameTiles);
} 

export default generateGameTiles;