import type { ITile, ITiles } from '$lib/components/game/types';
import { setContext, getContext } from 'svelte';
import { Players } from './types';

const { Top, Bottom } = Players;
  
interface IPlayerTiles {
    [Top]: ITiles;
    [Bottom]: ITiles;
};

export class PlayerTilesClass {
    tiles = $state<IPlayerTiles>({
        [Top]: [],
        [Bottom]: []
    });

    constructor() {
    }

    update(playerPosition: Players, playerTiles: ITile[]) {
        console.log("playerPosition1", playerPosition, playerTiles)
        console.log("playerPosition2", this.tiles[playerPosition])
		this.tiles[playerPosition] = playerTiles;
        console.log("playerPosition3", this.tiles[playerPosition])
	}

    remove(playerPosition: Players, tileId: number) {
        this.tiles[playerPosition] = this.tiles[playerPosition].filter(tile => tile.id != tileId);
    }
}

const KEY = Symbol("PLAYER_TILES");

export function setPlayerTilesState() {
    return setContext(KEY, new PlayerTilesClass());
}

export function getPlayerTilesState() {
    return getContext<ReturnType<typeof setPlayerTilesState>>(KEY)
}