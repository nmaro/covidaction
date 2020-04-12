import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../utils/db";
import jwt from "jsonwebtoken";
import { ObjectID } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await getDb();
  switch (req.method) {
    case "GET":
      const events = await db
        .collection("event")
        .find()
        .sort("date", 1)
        .toArray();
      const userIds = {};
      for (const event of events) {
        userIds[event.userId] = true;
      }
      const users = await db
        .collection("user")
        .find({
          _id: {
            $in: Object.keys(userIds).map(id => new ObjectID(id))
          }
        })
        .project({
          name: 1
        })
        .toArray();
      return res.status(200).json({ events, users });
    case "POST":
      if (!req.cookies.jwt) {
        throw new Error("Forbidden");
      }
      const { _id } = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET) as {
        _id: string;
      };
      await db.collection("event").insertMany(
        req.body.map(event => ({
          ...event,
          date: +new Date(),
          userId: new ObjectID(_id)
        }))
      );
      return res.status(200).json({});
  }
};
