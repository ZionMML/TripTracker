import { jwtDecode } from "jwt-decode";

export type JwtPayloadRaw = {
  role: string;
  exp: number;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
};

export type JwtPayload = {
  role: string;
  exp: number;
  userId: string;
};

export function getUserInfoFromToken(token: string): JwtPayload | null {
  //let token = localStorage.getItem("token");

  if (!token) return null;

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwtDecode<JwtPayloadRaw>(token);

    return {
      role: decoded.role,
      exp: decoded.exp,
      userId:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
    };
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
