import type { ITile, ITiles } from '$lib/components/game/types';
import { setContext, getContext } from 'svelte';
  
type IPlayerTiles = {
    tiles: ITiles;
};

export class PlayerTilesClass {
    tiles = $state<ITiles>([]);

    constructor() {
    }

    update(topPlayerTiles: ITile[]) {
		this.tiles = topPlayerTiles;
	}

    remove(tileId: number) {
        this.tiles = this.tiles.filter(tile => tile.id != tileId);
    }
}

const KEY = Symbol("PLAYER_TILES");

export function setPlayerTilesState() {
    return setContext(KEY, new PlayerTilesClass());
}

export function getPlayerTilesState() {
    return getContext<ReturnType<typeof setPlayerTilesState>>(KEY)
}