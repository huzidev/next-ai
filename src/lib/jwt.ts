import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Generate JWT Token
export function generateToken(userId: string) {
  const value = {
    id: userId,
  };
  const token = jwt.sign(value, JWT_SECRET, { expiresIn: "1h" });
  console.log('SW Generated token for user:', userId, 'Token:', token.substring(0, 20) + '...');
  return token;
}

// Verify JWT Token
export function verifyToken(token: string) {
  try {
    const result = jwt.verify(token, JWT_SECRET);
    console.log('SW JWT verification successful for token:', token.substring(0, 20) + '...');
    return result;
  } catch (error: unknown) {
    console.error("SW JWT verification error for token:", token.substring(0, 20) + '...', error);
    return null;
  }
}

// Decode JWT Token
export function decodeToken(token: string) {
  return jwt.decode(token);
}
