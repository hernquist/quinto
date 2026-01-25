import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { user as usersTable } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
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
      return fail(400, {
        error: "Must provide an email and password",
        email: email?.toString() || ""
      });
    }

    // check if the user exists
    const user = await db
      .select({
        email: usersTable.email,
        password: usersTable.password,
        username: usersTable.username,
        id: usersTable.id,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email.toString()))
      .limit(1);

    if (user.length === 0) {
      // throw error(404, "user account not found");
      return fail(401, {
        error: "user account not found",
        email: email.toString()
      });
    }

    // check if the password is correct
    const passwordIsRight = await bcrypt.compare(
      password.toString(),
      user[0]?.password || ""
    );

    if (!passwordIsRight) {
      return fail(401, {
        error: "incorrect password",
        email: email.toString()
      });
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