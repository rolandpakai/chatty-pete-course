import { readJson, writeJson } from "lib/jsondb";

export default async function handler(collectionName, obj) {
  const json = await readJson(collectionName);
  json.push(obj);

  await writeJson(collectionName, json);
}