import fs from 'fs';
import formidable from 'formidable';
import path from 'path';
import {v4 as uuid} from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFileFromStream = async (req, path)  => {
  const tmpPath = `${destPath}/${fileName}`;
  return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(tmpPath);

      req.pipe(writeStream);

      writeStream.on('finish', () => {
        resolve();
      });

      writeStream.on('error', (error) => {
        reject(error);
      });

      req.on('error', (error) => {
        req.destroy();
        writeStream.end();
        reject(error);
      });
  });
};

 export default async function handler(req, res) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const form = formidable({
    allowEmptyFiles: true,
    keepExtensions: true,
    multiples: true, 
    uploadDir: uploadDir, 
  });

  try {
    const file = await(new Promise((resolve, reject) => {
      form.parse(req, (err, _fields, files) => {
        if (err) {
          reject(err);
        }

        resolve(files.file[0]);
      })
    }))

    const fileData = {
      _id: uuid(),
      name: file.originalFilename,
      type: file.mimetype,
      size: file.size,
      lastModified: file.lastModifiedDate,
    };

    const originalFilePath = path.join(uploadDir, file.originalFilename);
    await fs.promises.rename(file.filepath, originalFilePath);

    res.status(200).send({ 
      data: fileData
    })
  } catch (err) {
    res.status(400).send({ error: `Internal server error: ${String(err)}` })
  }
}
