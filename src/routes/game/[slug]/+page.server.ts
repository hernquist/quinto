import { db } from "$lib/server/db";
import { game as gamesTable } from "$lib/server/db/schema";
import { verifyAuthJWT } from "$lib/server/jwt.js";
import { boards, Sizes } from "$lib/constants/boards.js";

// TODO: add fail
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async ({ params }) => {
  if (!params?.slug) {
    throw error(404, 'Game not found');
  }
  
  const gameId = Number(params.slug);
  
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

	return gameData
};

export const actions = {
    // TODO: move this?
    // TODO: is this a candidate for a remote function?
  createNewGame: async ({request, cookies}) => {
    const data = await request.formData();
    const multiple = data.get('multiple');
    const boardType = data.get('boardType') as Sizes
    const skill_level = data.get('skillLevel')

    const { rows, columns } = boards[boardType]; 

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
      skill_level,
    }).returning();

    redirect(303, `/game/${game.id}`);
  }  
};