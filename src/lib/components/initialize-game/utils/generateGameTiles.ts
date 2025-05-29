import { GameState  } from "$lib/state/game/game.svelte";

function generateGameTiles(gameState: GameState) {
    const startingNumberOfSquares = gameState.game.startingNumberOfSquares;
    const numberOfTiles = Math.round(startingNumberOfSquares * 0.50);

    let gameTiles = []

    for (let index = 0; index < numberOfTiles; index ++) {
        const value = Math.trunc(Math.random(1) * 9) + 1;
        const tile = {
            id: index,
            text: value,
            value,
        };
        gameTiles.push(tile);
    }

    gameState.updateGameTiles(gameTiles);
} 

export default generateGameTiles;