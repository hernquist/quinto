import { db } from "$lib/server/db";
import { game as gamesTable } from "$lib/server/db/schema";
import { verifyAuthJWT } from "$lib/server/jwt.js";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from "../../../$types";
import { eq } from "drizzle-orm";
import { user as usersTable } from "$lib/server/db/schema";
import { createNewGame } from "$lib/utils/createNewGame";

export const load: PageServerLoad = async ({ params, cookies }) => {
    // get the token from the cookie
    const token = cookies.get("auth_token");

    // return null token and null user
    if (!token) {
      return { token: null, user: null };
    }

    const userPayload = await verifyAuthJWT(token);

    const user = await db.select({
      email: usersTable.email,
      id: usersTable.id,
      username: usersTable.username,  
    })
      .from(usersTable)
      .where(eq(usersTable.id, userPayload.id));
      
    if (!params?.gameId) {
      throw error(404, 'Game not found');
    }

    const gameId = Number(params.gameId);

    if (isNaN(gameId)) {
      throw error(400, 'Invalid game ID');
    }

    const [gameData] = await db.select({
      id: gamesTable.id,
      rows: gamesTable.rows,
      columns: gamesTable.columns,
      skillLevel: gamesTable.skill_level,
      multiple: gamesTable.multiple
    })
      .from(gamesTable)
      .where(eq(gamesTable.id, gameId));

    if (!gameData) {
      throw error(404, 'Game not found');
    }

    // if there is a token, set user in store on the client
    return { gameData, gameId, user, token }
};

export const actions = {
    // @ts-ignore-next-line
    createNewGame
};
