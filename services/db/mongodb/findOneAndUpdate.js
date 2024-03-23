import { clientPromise, getCollection } from "lib/mongodb";

export default async function handler(obj) {
  const { _id, messages } = obj;
  const client = await clientPromise;
  const collection = await getCollection(client);

  const item = await collection.findOneAndUpdate({ _id }, {
    $push: {
      messages
    }
  }, {
    returnDocument: 'after',
  });

  return item;
}