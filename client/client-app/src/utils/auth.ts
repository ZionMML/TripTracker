import { jwtDecode } from "jwt-decode";

export type JwtPayload = {
  role: string;
  exp: number;
};

export function getUserInfoFromToken(token: string): JwtPayload | null {
  //let token = localStorage.getItem("token");

  if (!token) return null;

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    return decoded;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
