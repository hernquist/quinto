import type { PlayerState } from "$lib/state/player/player.svelte";

export function setUser(playerState: PlayerState, data: { token: null; user: null; } | { token: any; user: { email: string | null; id: number; username: string | null; }[]; }) {                                                                                  
    if (data?.token) {
        console.log("data", data);
        if (data?.user.length) {
            console.log("setting user...", data?.user[0]);
            playerState.setUser(data?.user[0]);
        }
    };
}