import { loginUser } from "@/db/Auth.server";
import { setCookie } from "@/lib/cookie";
import { generateToken } from "@/lib/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  const response = await loginUser({
    email,
    password,
  });

  if (response?.status === 200) {
    const token = generateToken(response.id);

    setCookie(token, res);

    return res.status(200).json({ data: response });
  } else {
    return res.status(response.status).json({ message: response.message });
  }
}
