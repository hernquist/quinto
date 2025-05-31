import type { ITiles } from "$lib/components/game/types";

enum Players {
    Top = 'TOP',
    Bottom = 'BOTTOM',
}

interface IPlayer {
    score: number;
    goesFirst: boolean;
    winner: boolean;
    isComputer: boolean;

}

interface IPlayerTiles {
    [Players.Top]: ITiles;
    [Players.Bottom]: ITiles;
};

interface IPlayers {
    [Players.Top]: IPlayer;
    [Players.Bottom]: IPlayer;
}

export type { IPlayer, IPlayerTiles, IPlayers };
export { Players };