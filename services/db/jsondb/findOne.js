import { readJson } from "lib/jsondb";

export default async function handler(obj) {
  const json = await readJson();
  const item = json.find(item => item._id === obj._id);

  return item;
}