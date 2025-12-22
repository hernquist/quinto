import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { user as usersTable } from "$lib/server/db/schema";
import { error, redirect } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import { createAuthJWT } from "$lib/server/jwt.js";

export const load = async (event) => {
  // get the sessionId from the cookie
  const token = event.cookies.get("auth_token");

  // if there is a token, redirect to the user page
  if (token && token !== "") {
    throw redirect(301, "/home");
  }
};

export const actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      throw error(400, "must provide an email and password");
    }

    // check if the user exists
    const user = await db
      .select({
        email: usersTable.email,
        password: usersTable.password,
        username: usersTable.username,
        // first_name: usersTable.first_name,
        // last_name: usersTable.last_name,
        id: usersTable.id,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email.toString()))
      .limit(1);

    if (user.length === 0) {
      throw error(404, "user account not found");
    }

    // check if the password is correct
    const passwordIsRight = await bcrypt.compare(
      password.toString(),
      user[0].password
    );

    if (!passwordIsRight) {
      throw error(400, "incorrect password...");
    }

    // create the JWT
    const token = await createAuthJWT({
      username: user[0].username || "",
      email: user[0].email || "",
      id: user[0].id,
    });

    // setting cookies to base path
    event.cookies.set("auth_token", token, {
      path: "/",
    });

    throw redirect(301, "/home");
  },
};