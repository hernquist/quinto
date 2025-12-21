import { db } from "$lib/server/db";
import { game as gamesTable } from "$lib/server/db/schema";
import { verifyAuthJWT } from "$lib/server/jwt.js";
import { boards, Sizes } from "$lib/constants/boards.js";
import { error, fail, redirect, type RequestHandler } from '@sveltejs/kit';
import type { PageServerLoad } from "../../../$types";
import { eq } from "drizzle-orm";
import { user as usersTable } from "$lib/server/db/schema";

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

    // return { token, user };
    // // if there is a token, set user in store on the client
    return { gameData, gameId, user, token }
};

export const actions = {
    // TODO: this is a duplicated action
    // TODO: is this a candidate for a remote function?
    createNewGame: async ({ request, cookies, params }) => {
        const data = await request.formData();
        let multiple, level, rows, columns;

        if (data instanceof FormData && data.has('multiple') || data.has('boardType') || data.has('skillLevel')) {
            multiple = data.get('multiple');
            level = data.get('skillLevel');
            const boardType = data.get('boardType') as Sizes;
            rows = boards[boardType].rows;
            columns = boards[boardType].columns; 
        } else {
            multiple = params.multiple;
            level = params.level;
            rows = params.rows;
            columns = params.columns;
        }

        const token = cookies.get("auth_token");

        // if there is a token, set user in store
        if (!token) {
            console.error("NO TOKEN IN game page server ts");
            return {}
        }
          
        const userPayload = await verifyAuthJWT(token);
        const user_id = userPayload.id

        const [game] = await db.insert(gamesTable).values({
            user_id,
            top_player: "H", // TEMPORARY TOP PLAYER
            bottom_player: "C", // TEMPORARY BOTTOM PLAYER
            winner: null,
            top_score: 0,
            bottom_score: 0,
            rows,
            columns,
            multiple,
            skill_level: level
        }).returning();

        redirect(303, `/game/${game.id}/${level}/${multiple}/${rows}/${columns}`);
    },
};