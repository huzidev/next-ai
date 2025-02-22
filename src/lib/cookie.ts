import { serialize, parse } from 'cookie';

// Function to set the JWT in cookie
export function setCookie(token: string, res: any) {
  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  });

  res.setHeader('Set-Cookie', cookie);
}

// Function to remove the JWT from cookie (logout)
export function removeCookie(res: any) {
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: -1, // Expire immediately
  });

  res.setHeader('Set-Cookie', cookie);
}

// Function to parse the JWT cookie (if needed)
export function getCookie(req: any) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  return cookies.token;
}
