import fetch from "isomorphic-unfetch";
import jwt from "jsonwebtoken";
import { getDb } from "../../utils/db";
import { NextApiRequest, NextApiResponse } from "next";

// Based on : https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;
  const result = await fetch(
    `https://graph.facebook.com/v6.0/oauth/access_token?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:3000/api/auth&client_secret=${process.env.CLIENT_SECRET}&code=${code}`
  );
  const { access_token } = await result.json();
  const result2 = await fetch(
    `https://graph.facebook.com/me?access_token=${access_token}`
  );
  const data = await result2.json();

  const { name, id: facebookId, error } = data;
  if (error) {
    throw new Error(error.message);
  }

  const db = await getDb();

  let user = await db.collection("user").findOne({
    facebookId
  });
  if (!user) {
    const { insertedId } = await db.collection("user").insertOne({
      name,
      facebookId
    });
    user = await db.collection("user").findOne({ _id: insertedId });
  }

  res.setHeader(
    "Set-Cookie",
    `jwt=${jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d"
    })}; Max-Age=${30 * 24 * 60 * 60}; Path=/`
  );

  res
    .status(200)
    .send(`<head><meta http-equiv="Refresh" content="0; URL=/"></head>`);
};
