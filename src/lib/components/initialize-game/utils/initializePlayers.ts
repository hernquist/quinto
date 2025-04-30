import { getGameState } from "$lib/state/game/game.svelte";
import { getPlayerState } from "$lib/state/player/player.svelte";
import { Players, type IPlayer } from "$lib/state/types";

const { Top, Bottom } = Players;

function initializePlayers() {
    const playerState = getPlayerState();
    const gameState = getGameState();
    // determine first player
    const topPlayerFirst = Math.random() >= 0.5;
    const bottomPlayerFirst = !topPlayerFirst;
    const activePlayer = topPlayerFirst ? Top : Bottom;
    gameState.updateActivePlayer(activePlayer);

    // get topPlayers tiles
    const gameTiles = gameState.game.tiles;
    const topPlayerTiles = gameTiles.splice(0, 5);
    // update game tiles
    gameState.updateTiles(gameTiles);
    
    const top: IPlayer = {
        goesFirst: topPlayerFirst,
        score: 0,
    };

    // update top player
    playerState.updatePlayer(Top, top);

    // get updated game tiles
    const updatedGameTiles = gameState.game.tiles;
    const bottomPlayerTiles = updatedGameTiles.splice(0, 5);
    // update game tiles again
    gameState.updateTiles(updatedGameTiles);

    const bottom: IPlayer = {
        goesFirst: bottomPlayerFirst,
        score: 0,
    };

    // update bottom player
    playerState.updatePlayer(Bottom, bottom);

    // probably don't need to do this anymore
    return {
        topPlayerTiles,
        bottomPlayerTiles
    }
} 

export default initializePlayers;