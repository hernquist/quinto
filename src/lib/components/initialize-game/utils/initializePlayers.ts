import { getGameTiles, updateActivePlayer, updatePlayer, updateTiles } from "../../../../state/state.svelte";
import { Players, type IPlayer } from "../../../../state/types";

function initializePlayers() {
    const topPlayerFirst = Math.random() >= 0.5;
    const bottomPlayerFirst = !topPlayerFirst;
    const { Top, Bottom } = Players;

    const activePlayer = topPlayerFirst ? Top : Bottom;
    updateActivePlayer(activePlayer);

    const gameTiles = getGameTiles();
    const topPlayerTiles = gameTiles.splice(0, 5);
    updateTiles(gameTiles);
    
    const top: IPlayer = {
        goesFirst: topPlayerFirst,
        score: 0,
        tiles: topPlayerTiles
    };

    updatePlayer(Top, top);

    const updatedGameTimes = getGameTiles();
    const bottomPlayerTiles = updatedGameTimes.splice(0, 5);
    updateTiles(updatedGameTimes);

    const bottom: IPlayer = {
        goesFirst: bottomPlayerFirst,
        score: 0,
        tiles: bottomPlayerTiles
    };

    updatePlayer(Bottom, bottom);
} 

export default initializePlayers;