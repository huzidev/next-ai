import { parse, serialize } from 'cookie';

interface ConfigValues {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict" | "lax" | "none";
    path: string;
}

const config: ConfigValues = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

// Function to set the JWT in cookie
export function setCookie(token: string, res: any) {
  const cookie = serialize('token', token, {
    ...config,
    maxAge: 60 * 60, // 1 hour
  });

  res.setHeader('Set-Cookie', cookie);
}

// Function to remove the JWT from cookie (logout)
export function removeCookie(res: any) {
  const cookie = serialize('token', '', {
    ...config,
    maxAge: -1, // Expire immediately
  });

  res.setHeader('Set-Cookie', cookie);
}

// Function to parse the JWT cookie (if needed)
export function getCookie(req: any) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  return cookies.token;
}
