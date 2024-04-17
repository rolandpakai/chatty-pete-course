import { readJson } from "lib/jsondb";

export default async function handler(collectionName, obj) {
  const json = await readJson(collectionName);
  const item = json.find(item => Object.keys(obj).every(key => item[key] === obj[key]));

  return item;
}