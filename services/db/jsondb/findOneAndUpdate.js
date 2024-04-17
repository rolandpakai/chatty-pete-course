import { readJson, writeJson } from "lib/jsondb";

export default async function handler(collectionName, obj) {
  const json = await readJson(collectionName);
  let item;

  switch (collectionName) {
    case process.env.COLLECTION_NAME_CHATS: {
      item = json.find(item => item._id === obj._id);

      if (item) {
        item.messages.push(obj.messages);
        await writeJson(collectionName, json);
      }
      break;
    }
    case process.env.COLLECTION_NAME_PROMPTS: {
      item = json.find(item => item.url === obj.url);
      if (item) {
        Object.assign(item, { ...obj });
        await writeJson(collectionName, json);
      }
      break;
    }
    default: {
      break;
    }
  }
  
  return item;
}