import { readJson, writeJson } from "lib/jsondb";

export default async function handler(obj) {
  const json = await readJson();
  const item = json.find(item => item._id === obj._id);

  if (item) {
    item.messages.push(obj.messages);

    await writeJson(json);
  }

  return item;
}