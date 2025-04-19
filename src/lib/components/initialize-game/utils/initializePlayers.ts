import { getGameTiles, updateActivePlayer, updatePlayer, updateTiles } from "../../../../lib/state/state.svelte";
import { Players, type IPlayer } from "../../../../lib/state/types";

function initializePlayers() {
    const topPlayerFirst = Math.random() >= 0.5;
    const bottomPlayerFirst = !topPlayerFirst;
    const { Top, Bottom } = Players;

    const activePlayer = topPlayerFirst ? Top : Bottom;
    updateActivePlayer(activePlayer);

    const gameTiles = getGameTiles();
    console.log("topPlayerTiles-gameTiles", gameTiles);
    const topPlayerTiles = gameTiles.splice(0, 5);
    console.log("topPlayerTiles-toptiles", topPlayerTiles);
    updateTiles(gameTiles);
    
    const top: IPlayer = {
        goesFirst: topPlayerFirst,
        score: 0,
    };

    updatePlayer(Top, top);

    const updatedGameTimes = getGameTiles();
    const bottomPlayerTiles = updatedGameTimes.splice(0, 5);
    updateTiles(updatedGameTimes);

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