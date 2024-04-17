import { clientPromise, getCollection } from "lib/mongodb";

export default async function handler(collectionName, obj) {
  const client = await clientPromise;
  const collection = await getCollection(collectionName, client);
  let item;

  switch (collectionName) {
    case process.env.COLLECTION_NAME_CHATS: {
      item = await collection.findOneAndUpdate({ _id: obj._id }, {
        $push: {
          messages: obj.messages,
        }
      }, {
        returnDocument: 'after',
      });
      break;
    }
    case process.env.COLLECTION_NAME_PROMPTS: {
      item = await collection.findOneAndUpdate({ url: obj.url }, {
        $set: {
          document: obj.document,
        }
      }, {
        returnDocument: 'after',
      });
      break;
    }
    default: {
      break;
    }
  }

  return item;
}