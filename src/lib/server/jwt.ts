import { error } from "@sveltejs/kit";
import * as jose from "jose";

type JWTPayload = {
  username: string;
  email: string;
  id: number;
};

export const getJwtSecret = (): string => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');

  return process.env.JWT_SECRET;
}

export const createAuthJWT = async (data: JWTPayload) => {
  
  const jwt = await new jose.SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(getJwtSecret()));
  return jwt;
};

export const verifyAuthJWT = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecret())
    );
    return payload as JWTPayload;
  } catch {
    throw error(401, "invalid or missing JWT, you are not logged in");
  }
};