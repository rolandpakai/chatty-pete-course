import { readJson } from "lib/jsondb";

export default async function handler() {
  const json = await readJson();
  return json;
}