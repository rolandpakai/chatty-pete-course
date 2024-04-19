import fs from 'fs';
import path from 'path';

async function listAvatars(directory) {
  let imageFiles = [];
  const themeDirs = await fs.promises.readdir(directory);
  const randomIndex = Math.floor(Math.random() * themeDirs.length);
  const randomTheme = themeDirs[randomIndex];
  
  const themePath = path.join(directory, randomTheme);
  const files = await fs.promises.readdir(themePath);
  
  for (const file of files) {
    const filePath = path.join(themePath, file);
    const fileStat = await fs.promises.stat(filePath);

    if (fileStat.isFile()) {
      if (/\.(jpg|jpeg|png|gif|svg)$/i.test(file)) {
        const theme = file.split('-')[0];
        
        imageFiles.push({
          name: file,
          theme,
          src: `/images/avatars/${theme}/${file}`
        });
      }
    }
  }

  return imageFiles;
}

export default async function handle(req, res) {
  const imagesDirectory = path.join(process.cwd(), 'public', 'images', 'avatars');

  try {
    const avatars = await listAvatars(imagesDirectory);
    res.status(200).json({ avatars });
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}