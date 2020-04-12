import { MongoClient, Db } from "mongodb";

let db: Db;
export const getDb = async () => {
  if (!db) {
    const client = await MongoClient.connect(process.env.MONGODB_URL);
    db = client.db(process.env.MONGODB_NAME);
  }
  return db;
};
