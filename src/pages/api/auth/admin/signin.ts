import { LikePost } from "@/db/Post.server";
import { getUserById } from "@/db/User.server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest,res: NextApiResponse) {
  const { email, password } = req.body;

    const response = await getUser({
        email,
        password,
    })

  if (response) {
    return res.status(200).json({ data: response });
  } else {
    return res.status(404).json(null);
  }
}