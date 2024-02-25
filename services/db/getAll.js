import { readJson } from "lib/jsondb";

export default async function handler(filter) {
  const json = await readJson(filter);
  return json;
}