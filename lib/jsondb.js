import * as fs from 'lib/fswrapper';
const CHAT_DB = process.env.CHAT_DB;

export const readJson = async (filter) => {
  const isExists = await fs.existsSync(CHAT_DB);

  if (isExists) {
    const jsonFile = await fs.readFileSync(CHAT_DB);
    
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
  const exists = await fs.existsSync(CHAT_DB);

  if (exists) {
    await fs.writeFileSync(CHAT_DB, JSON.stringify(json));
  } else {
    throw new Error(`No such file or directory ${path}`);
  }
}
