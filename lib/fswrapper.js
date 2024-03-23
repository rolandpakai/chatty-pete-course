import fs from 'fs';

export const existsSync = async (path) => {
  return fs.existsSync(path)
}

export const readFileSync = async (path) => {
  return fs.readFileSync(path, { encoding: "utf-8" })
}

export const writeFileSync = async (path, data) => {
  fs.writeFileSync(
    path,
    data,
  );
}

export const readdirSync = async (path) => {
  return fs.readdirSync(path);
}

export const readFolder = async (folderPath, filter) => {
  let files = await readdirSync(folderPath);

  if (filter) {
    files = files.filter(file => file.endsWith(filter));
  }

  return files;
}
