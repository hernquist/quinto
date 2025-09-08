import bcrypt from "bcrypt";
import { db } from "$lib/server/db";
import { user as usersTable } from "$lib/server/db/schema";
import { redirect } from "@sveltejs/kit";
import { createAuthJWT } from "$lib/server/jwt";

export const config = {
  runtime: "nodejs18.x",
};

export const load = async (event) => {
  // get the token from the cookie
  const token = event.cookies.get("auth_token");

  // if there is a token, redirect to the user page
  if (token) {
    throw redirect(301, "/");
  }
};

export const actions = {
  default: async (event) => {
    // TODO: THIS SHOULD BE VALIDATEDx
    const formData = await event.request.formData();
    const email = formData.get("email") || "";
    const password = formData.get("password") || "";
    const username = formData.get("username") || "";

    const hash = bcrypt.hashSync(password?.toString(), 10);

    const [nUser] = await db.insert(usersTable).values({
      username: username.toString(),
      email: email.toString(),
      password: hash,
    }).returning();

    const token = await createAuthJWT({
      username: username.toString(),
      email: email.toString(),
      id: parseInt(nUser?.id),
    });

    event.cookies.set("auth_token", token, {
      path: "/",
    });

    throw redirect(301, "/");
  },
};