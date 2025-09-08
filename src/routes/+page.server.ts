import { db } from "$lib/server/db";
import { user as usersTable } from "$lib/server/db/schema";
import { verifyAuthJWT } from "$lib/server/jwt.js";
import { eq } from "drizzle-orm";

export const config = {
  runtime: "nodejs18.x",
};

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

