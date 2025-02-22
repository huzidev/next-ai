import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Generate JWT Token
export function generateToken(userId: string) {
  const value = {
    id: userId,
  };
  return jwt.sign(value, JWT_SECRET, { expiresIn: "1h" });
}

// Verify JWT Token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error: unknown) {
    console.error("Error  : ", error);
    return null;
  }
}

// Decode JWT Token
export function decodeToken(token: string) {
  return jwt.decode(token);
}
