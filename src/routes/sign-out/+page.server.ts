import { redirect } from "@sveltejs/kit";
import { getPlayerState } from "$lib/state/player/player.svelte.js";

export const load = async (event) => {
    // logout user by clearing auth_token cookie
    console.log("----------------------------------------------");
    console.log("Signing out user by clearing auth_token cookie");
    console.log("----------------------------------------------");

    // clear player state
    const playerState = getPlayerState();
    playerState.clearUser();

    // clear cookie
    event.cookies.set("auth_token", "", { path: "/" });

    // redirect to the sign-in page
    // TODO: "/sign-in" or play page???
    throw redirect(301, "/sign-in");
};