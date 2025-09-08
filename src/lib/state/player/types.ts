import type { ITile } from "$lib/components/game/types";

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
    [Players.Top]: ITile[];
    [Players.Bottom]: ITile[];
};

interface IPlayers {
    [Players.Top]: IPlayer;
    [Players.Bottom]: IPlayer;
}

interface IHumanPlayer {
    position: Players;
    name: string;
    isLoggedIn: boolean;
    user?: {
        id: number;
        username: string;
        email: string;
    }
}

export type { IPlayer, IPlayerTiles, IPlayers, IHumanPlayer };
export { Players };