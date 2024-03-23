import { clientPromise, getCollection } from "lib/mongodb";

export default async function handler(obj) {
  const client = await clientPromise;
  const collection = await getCollection(client);

  const item = await collection.findOne(obj);

  return item;
}