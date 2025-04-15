import { gameState } from "../../../../state/state.svelte";
import { Players, type IPlayer } from "../../../../state/types";

function initializePlayers() {
    const topPlayerFirst = Math.random() >= 0.5;
    const bottomPlayerFirst = !topPlayerFirst;

    gameState.activePlayer = topPlayerFirst ? Players.Top : Players.Bottom;

    const top: IPlayer = {
        goesFirst: topPlayerFirst,
        score: 0,
        tiles: gameState.tiles.splice(0, 5)
    }

    gameState[Players.Top] = top;

    const bottom: IPlayer = {
        goesFirst: bottomPlayerFirst,
        score: 0,
        tiles: gameState.tiles.splice(0, 5)
    }

    gameState[Players.Bottom] = bottom;
} 

export default initializePlayers;