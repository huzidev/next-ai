import { verifyUser } from "@/db/Auth.server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, code } = req.body;

  const response = await verifyUser(userId, code);

  if (response) {
    return res.status(200).json({ data: response });
  } else {
    return res.status(404).json(null);
  }
}
