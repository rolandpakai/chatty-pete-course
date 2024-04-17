import * as fs from 'lib/fswrapper';

const FOLDER_PATH = 'db';
const JSON_EXTENSION = 'json';

const getFilePath = (name) => {
  return `${FOLDER_PATH}/${name}.${JSON_EXTENSION}`;
}

export const readJson = async (collectionName, filter) => {
  const filePath = getFilePath(collectionName);
  const isExists = await fs.existsSync(filePath);

  if (isExists) {
    let jsonFile = await fs.readFileSync(filePath);

    if (jsonFile === '') {
      jsonFile = '[]';
    }
    
    try {
      let json = JSON.parse(jsonFile);

      if (filter) {
        json = json.filter(item =>Object.keys(filter).every(key => item[key] === filter[key]))
      }

      return json;
    } catch (e) {
      throw new Error(`JSON parse error`)
    }
  } else {
    throw new Error(`No such file or directory ${filePath}`);
  }
}

export const writeJson = async (collectionName, json) => {
  const filePath = getFilePath(collectionName);

  const exists = await fs.existsSync(filePath);

  if (exists) {
    await fs.writeFileSync(filePath, JSON.stringify(json));
  } else {
    throw new Error(`No such file or directory ${filePath}`);
  }
}
