import { db } from "$lib/server/db";
import { game as gamesTable } from "$lib/server/db/schema";
import { verifyAuthJWT } from "$lib/server/jwt.js";
import { boards, Sizes } from "$lib/constants/boards.js";

import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    createNewGame: async ({request, cookies}) => {
      const data = await request.formData();
      const multiple = data.get('multiple');
      const boardType = data.get('boardType') as Sizes
      const skill_level = data.get('skillLevel')

      const { rows, columns } = boards[boardType]; 
      console.log("HIT!!!!!!!!!!!!!!!!!!!!!!!!!", multiple, boardType, skill_level )

      const token = cookies.get("auth_token");

      // if there is a token, set user in store
      if (!token) {
        console.log("NO TOKEN IN game page server ts");
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