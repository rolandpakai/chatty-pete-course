import { clientPromise, getCollection } from "lib/mongodb";

export default async function handler(filter) {
  const client = await clientPromise;
  const collection = await getCollection(client);
  
  const list = await collection.find(filter, {
    projection: {
      userId: 0,
      messages: 0,
    }
  }).sort({
    _id: -1,
  }).toArray();

  return list;
}