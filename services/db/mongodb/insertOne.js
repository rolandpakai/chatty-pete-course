import { clientPromise, getCollection } from "lib/mongodb";

export default async function handler(collectionName, obj) {
  const client = await clientPromise;
  const collection = await getCollection(collectionName, client);

  await collection.insertOne(obj);
}