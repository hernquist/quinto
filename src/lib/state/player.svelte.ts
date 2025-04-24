import type { ITile } from '$lib/components/game/types';
import { setContext, getContext } from 'svelte';
import { Players, type IPlayer, type IPlayerTiles, type IPlayers } from './types';

const { Top, Bottom } = Players; 

const initPlayer: IPlayer = {	
    score: 0,
	goesFirst: false,
}

export interface IPlayerState {
    tiles: IPlayerTiles;
    player: IPlayers
} 

export class PlayerState {
    tiles = $state<IPlayerTiles>({
        [Top]: [],
        [Bottom]: []
    });

    player = $state<IPlayers>({
        [Top]: initPlayer,
        [Bottom]: initPlayer
    })

    constructor() {
    }

    updateTiles(playerPosition: Players, playerTiles: ITile[]) {
		this.tiles[playerPosition] = playerTiles;
	}

    removeTile(playerPosition: Players, tileId: number) {
        this.tiles[playerPosition] = this.tiles[playerPosition].filter(tile => tile.id != tileId);
    }

    updatePlayer(playerPosition: Players, player: IPlayer): void {
        this.player[playerPosition] = player;
    }
}

const KEY = Symbol("PLAYER_TILES");

export function setPlayerState() {
    return setContext(KEY, new PlayerState());
}

export function getPlayerState() {
    return getContext<ReturnType<typeof setPlayerState>>(KEY)
}