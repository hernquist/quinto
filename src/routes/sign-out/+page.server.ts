import { redirect } from "@sveltejs/kit";

export const config = {
    runtime: "nodejs18.x",
};

export const load = async (event) => {
    // remove the cookie
    console.log("----------------------------------------------");
    console.log("Signing out user by clearing auth_token cookie");
    console.log("----------------------------------------------");

    event.cookies.set("auth_token", "", { path: "/" });

    // redirect to the sign-in page
    // TODO: "/sign-in" or play page???
    throw redirect(301, "/sign-in");
};