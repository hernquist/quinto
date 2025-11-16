import { db } from "$lib/server/db";
import { user as usersTable } from "$lib/server/db/schema";
import { game as gamesTable } from "$lib/server/db/schema";
import { verifyAuthJWT } from "$lib/server/jwt.js";
import { eq } from "drizzle-orm";

export const load = async (event) => {
  // get the token from the cookie
  const token = event.cookies.get("auth_token");

  // if there is a token, set user in store
  if (!token) {
    return {};
  }
  
  const userPayload = await verifyAuthJWT(token);

  const user = await db.select({
        email: usersTable.email,
        id: usersTable.id,
        username: usersTable.username,  
    })
    .from(usersTable)
    .where(eq(usersTable.id, userPayload.id));
    
  return { token, user };
}

export const actions = {
  createNewGame: async () => {
    console.log("HIT!!!!!!!!!!!!!!!!!!!!!!!!!")
    await db.insert(gamesTable).values({
      user_id: 14, // TEMPORARY USER ID
      top_player: "H", // TEMPORARY TOP PLAYER
      bottom_player: "C", // TEMPORARY BOTTOM PLAYER
      winner: null,
      top_score: 0,
      bottom_score: 0,
      rows: 4,
      columns: 6,
      multiple: 2,
      skill_level: 3,
    })
  }  
};


