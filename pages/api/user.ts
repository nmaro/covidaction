import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { getDb } from "../../utils/db";
import { ObjectID } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.cookies.jwt) {
    return res.status(200).json({});
  }

  const { _id } = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET) as {
    _id: string;
  };
  const user = await (await getDb())
    .collection("user")
    .findOne({ _id: new ObjectID(_id) }, { projection: { name: 1 } });

  return res.status(200).json({ user });
};
