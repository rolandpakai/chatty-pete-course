import { writeJson } from "lib/jsondb";

export default async function handler(obj) {
  await writeJson(obj);
}