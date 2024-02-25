import { readJson, writeJson } from "lib/jsondb";

export default async function handler(obj) {
  const json = await readJson();
  json.push(obj);

  await writeJson(json);
}