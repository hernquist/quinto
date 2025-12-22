import { redirect } from '@sveltejs/kit'

export const load = async (event) => {
  return redirect(301, "/home");
}
