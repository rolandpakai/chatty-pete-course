import { readJson } from "lib/jsondb";

export default async function handler(collectionName, filter) {
  const json = await readJson(collectionName, filter);
  return json;
}