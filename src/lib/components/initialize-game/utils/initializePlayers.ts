import { getGameState, updatePlayer } from "../../../../lib/state/state.svelte";
import { Players, type IPlayer } from "../../../../lib/state/types";

function initializePlayers() {
    const gameState = getGameState();

    const topPlayerFirst = Math.random() >= 0.5;
    const bottomPlayerFirst = !topPlayerFirst;
    const { Top, Bottom } = Players;

    const activePlayer = topPlayerFirst ? Top : Bottom;
    gameState.updateActivePlayer(activePlayer);

    const gameTiles = gameState.game.tiles;
    const topPlayerTiles = gameTiles.splice(0, 5);
    gameState.updateTiles(gameTiles);
    
    const top: IPlayer = {
        goesFirst: topPlayerFirst,
        score: 0,
    };

    updatePlayer(Top, top);

    const updatedGameTimes = gameState.game.tiles;
    const bottomPlayerTiles = updatedGameTimes.splice(0, 5);
    gameState.updateTiles(updatedGameTimes);

    const bottom: IPlayer = {
        goesFirst: bottomPlayerFirst,
        score: 0,
    };

    updatePlayer(Bottom, bottom);
    return {
        topPlayerTiles,
        bottomPlayerTiles
    }
} 

export default initializePlayers;