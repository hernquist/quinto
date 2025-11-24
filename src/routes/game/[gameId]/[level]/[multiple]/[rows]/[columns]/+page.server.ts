import { db } from "$lib/server/db";
import { game as gamesTable } from "$lib/server/db/schema";
import { verifyAuthJWT } from "$lib/server/jwt.js";
import { boards, Sizes } from "$lib/constants/boards.js";
import { error, fail, redirect, type RequestHandler } from '@sveltejs/kit';
import type { PageServerLoad } from "../../../$types";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async ({ params }) => {
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

	return { gameData, gameId }
};


export const actions = {
    // TODO: move this?
    // TODO: is this a candidate for a remote function?
  createNewGame: async ({ request, cookies, params }) => {
    const data = await request.formData();
    let multiple, level, rows, columns;

    if (data instanceof FormData && data.has('multiple') || data.has('boardType') || data.has('skillLevel')) {
      multiple = data.get('multiple');
      const boardType = data.get('boardType') as Sizes;
      level = data.get('skillLevel');
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