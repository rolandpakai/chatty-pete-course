import {v4 as uuid} from 'uuid';
import { getSession } from "lib/auth/auth";
import { insertOne, findOneAndUpdate } from 'services/db';

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const { url, label, content, type, page } = req.body;

    const prompt = {
      _id: uuid(),
      url,
      label,
      content,
      type,
      page,
    };

    const promptItem = await findOneAndUpdate(process.env.COLLECTION_NAME_PROMPTS, { url, content });

    if (!promptItem) {
      await insertOne(process.env.COLLECTION_NAME_PROMPTS, prompt);
    } else {
      Object.assign(prompt, {
        ...promptItem,
      });
    }

    res.status(200).json({
      prompt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred when creating a new prompt."
    });
  }
}