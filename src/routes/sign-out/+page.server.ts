import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
  // remove the cookie
  event.cookies.set("auth_token", "", { path: "/" });

  // redirect to the sign-in page
  // TODO: "/sign-in" or play page???
  throw redirect(301, "/sign-in");
};