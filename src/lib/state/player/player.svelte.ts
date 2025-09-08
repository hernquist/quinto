import { setContext, getContext } from 'svelte';
import type { ITile } from '$lib/components/game/types';
import { Players, type IPlayer, type IPlayerTiles, type IPlayers, type IHumanPlayer } from './types';
import { GameStatus, type IGameState } from '../game/types';
import { textLevelTuple } from '$lib/utils/textual';
import type { GameState } from '../game/game.svelte';

const { Top, Bottom } = Players; 

const initPlayer: IPlayer = {	
    score: 0,
	goesFirst: false,
    winner: false,
    isComputer: false // not needed, it is set in the initializePlayers func
}

export interface ISetWinner {
    isTieGame: boolean
}

export interface IPlayerState {
    tiles: IPlayerTiles;
    player: IPlayers
    humanPlayer: IHumanPlayer;
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

    humanPlayer = $state<IHumanPlayer>({
        position: Players.Top,
        name: "Human",
        isLoggedIn: false,
    });

    constructor() {
    }

    public getTiles(playerPosition: Players): ITile[] {
        return this.tiles[playerPosition];
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

    public getWinnerName(gameState: GameState): string {
        if (this.player[Top].winner) {
            return this.getPlayerName();
        }
        if (this.player[Bottom].winner) {
            const levelIndex = gameState.game.playLevel - 1
            return textLevelTuple[levelIndex]
        }

        return "";
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

    public getPlayerName(): string {
        return this.isLoggedIn() ? this.humanPlayer.user?.username || "" : this.humanPlayer.name;
    }

    public isLoggedIn(): boolean {
        return this.humanPlayer.isLoggedIn;
    }

    public setUser(user: { id: number; username: string; email: string; }): void {
        this.humanPlayer.user = user;
        this.humanPlayer.isLoggedIn = true;
    }
    
    public clearUser() {
        this.humanPlayer.user = undefined;
        this.humanPlayer.isLoggedIn = false;
    }
}

const KEY = Symbol("PLAYER_TILES");

export function setPlayerState() {
    return setContext(KEY, new PlayerState());
}

export function getPlayerState() {
    return getContext<ReturnType<typeof setPlayerState>>(KEY)
}