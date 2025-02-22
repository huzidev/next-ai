import { createUser } from "@/db/Auth.server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, username, password, confirmPassword } = req.body;

  const response = await createUser({
    email,
    username,
    password,
    confirmPassword,
  });

  if (response) {
    return res.status(200).json({ data: response });
  } else {
    return res.status(404).json(null);
  }
}
