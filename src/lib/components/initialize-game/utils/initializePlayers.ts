import { GameState } from "$lib/state/game/game.svelte";
import { PlayerState } from "$lib/state/player/player.svelte";
import { Players, type IPlayer } from "$lib/state/player/types";

const { Top, Bottom } = Players;

function initializePlayers(playerState: PlayerState, gameState: GameState) {
    // determine first player
    const topPlayerFirst = Math.random() >= 0.5;
    const bottomPlayerFirst = !topPlayerFirst;
    const activePlayer = topPlayerFirst ? Top : Bottom;
    gameState.updateActivePlayer(activePlayer);

    // get topPlayers tiles
    const gameTiles = gameState.game.tiles;
    const topPlayerTiles = gameTiles.splice(0, 5);
    // update game tiles
    gameState.updateGameTiles(gameTiles);
    
    const top: IPlayer = {
        goesFirst: topPlayerFirst,
        score: 0,
        winner: false,
        isComputer: false // setting it equal to false
    };

    // update top player
    playerState.updatePlayer(Top, top);

    // get updated game tiles
    const updatedGameTiles = gameState.game.tiles;
    const bottomPlayerTiles = updatedGameTiles.splice(0, 5);
    // update game tiles again
    gameState.updateGameTiles(updatedGameTiles);

    const bottom: IPlayer = {
        goesFirst: bottomPlayerFirst,
        score: 0,
        winner: false,
        isComputer: true, // forcing it to be true
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