import bcrypt from "bcrypt";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { user as usersTable } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import { createAuthJWT } from "$lib/server/jwt";

export const load = async (event) => {
  // get the token from the cookie
  const token = event.cookies.get("auth_token");

  // if there is a token, redirect to the user page
  if (token) {
    throw redirect(301, "/home");
  }
};

export const actions = {
  default: async (event) => {
    // TODO: THIS SHOULD BE VALIDATED
    const formData = await event.request.formData();
    const email = formData.get("email") || "";
    const password = formData.get("password") || "";
    const username = formData.get("username") || "";

    // Check if username already exists
    const existingUser = await db
      .select({ username: usersTable.username })
      .from(usersTable)
      .where(eq(usersTable.username, username.toString()))
      .limit(1);

    if (existingUser.length > 0) {
      return fail(409, {
        error: "Username already taken",
        username: username.toString(),
        email: email.toString()
      });
    }

    const hash = bcrypt.hashSync(password?.toString(), 10);

    try {
      const [nUser] = await db.insert(usersTable).values({
        username: username.toString(),
        email: email.toString(),
        password: hash,
      }).returning();

      if (!nUser) {
        return fail(500, {
          error: "Failed to create user",
          username: username.toString(),
          email: email.toString()
        });
      }

      const token = await createAuthJWT({
        username: username.toString(),
        email: email.toString(),
        id: nUser.id,
      });

      event.cookies.set("auth_token", token, {
        path: "/",
      });

      throw redirect(301, "/home");
    } catch (error: any) {
      // Handle database-level unique constraint violations as a fallback
      if (error?.code === "23505" || error?.message?.includes("unique") || error?.message?.includes("duplicate")) {
        return fail(409, {
          error: "Username or email already taken",
          username: username.toString(),
          email: email.toString()
        });
      }
      // Re-throw other errors
      throw error;
    }
  }
};
