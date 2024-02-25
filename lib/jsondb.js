import * as fs from 'fs';
const CHAT_DB = process.env.CHAT_DB;

const existsSync = async (path) => {
  return fs.existsSync(path)
}

const readFileSync = async (path) => {
  return fs.readFileSync(path, { encoding: "utf-8" })
}

const writeFileSync = async (path, json) => {
  fs.writeFileSync(
    path,
    json
  );
}

export const readJson = async (filter) => {
  const isExists = await existsSync(CHAT_DB);

  if (isExists) {
    const jsonFile = await readFileSync(CHAT_DB);
    
    try {
      let json = JSON.parse(jsonFile);

      if (filter) {
        json = json.filter(item => item.userId === filter.userId)
      }

      return json;
    } catch (e) {
      throw new Error(`JSON parse error`)
    }
  } else {
    throw new Error(`No such file or directory ${CHAT_DB}`);
  }
}

export const writeJson = async (json) => {
  const exists = await existsSync(CHAT_DB);

  if (exists) {
    await writeFileSync(CHAT_DB, JSON.stringify(json));
  } else {
    throw new Error(`No such file or directory ${path}`);
  }
}
