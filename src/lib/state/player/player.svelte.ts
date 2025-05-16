import { setContext, getContext } from 'svelte';
import type { ITile } from '$lib/components/game/types';
import { Players, type IPlayer, type IPlayerTiles, type IPlayers } from './types';
import { GameStatus, type IGameState } from '../game/types';

const { Top, Bottom } = Players; 

const initPlayer: IPlayer = {	
    score: 0,
	goesFirst: false,
    winner: false,
}

export interface ISetWinner {
    isTieGame: boolean
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

    public updateTiles(playerPosition: Players, playerTiles: ITile[]) {
		this.tiles[playerPosition] = playerTiles;
	}

    public removeTile(playerPosition: Players, tileId: number) {
        this.tiles[playerPosition] = this.tiles[playerPosition].filter(tile => tile.id != tileId);
    }

    public updatePlayer(playerPosition: Players, player: IPlayer): void {
        this.player[playerPosition] = player;
    }

    public hasNoTiles(playerPosition: Players): boolean {
        return this.tiles[playerPosition].length === 0;
    }

    public getWinner() {
        if (this.player[Top].winner) {
            return ({
                name: Top,
                player: this.player[Top]
            })
        }
        if (this.player[Bottom].winner) {
            return ({
                name: Bottom,
                player: this.player[Bottom]
            })
        }

        return ({
            name: "", 
            player: null
        })
    }

    public setWinner(gameState: IGameState): ISetWinner {
        let tieGameStatus = { isTieGame: false };

        if (gameState.status === GameStatus.Complete) {
            if (this.player[Top].score === this.player[Bottom].score) {
                tieGameStatus.isTieGame = true
                return tieGameStatus;
            }

            if (this.player[Top].score > this.player[Bottom].score) {
                this.player[Top].winner = true;
                return tieGameStatus
            } 
            if (this.player[Bottom].score > this.player[Top].score) {
                this.player[Bottom].winner = true;
                return tieGameStatus;   
            }
        } 

        console.error("error: setWinner checked while gameState status not COMPLETE");
        return tieGameStatus;
    }
}

const KEY = Symbol("PLAYER_TILES");

export function setPlayerState() {
    return setContext(KEY, new PlayerState());
}

export function getPlayerState() {
    return getContext<ReturnType<typeof setPlayerState>>(KEY)
}