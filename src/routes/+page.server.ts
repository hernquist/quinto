export const config = {
  runtime: "nodejs18.x",
};

export const load = async (event) => {
  // get the token from the cookie
  const token = event.cookies.get("auth_token");

  // if there is a token, set user in store
  console.log("token----------------------------", token);
  return { token };
}
