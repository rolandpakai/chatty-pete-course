import { getSession } from "lib/auth/auth";
import { getAll } from 'services/db';

export default async function handle(req, res) {
  try {
    try {
      //const { user } = await getSession(req, res);
      const prompts = await getAll(process.env.COLLECTION_NAME_PROMPTS);
      res.status(200).json({ prompts });
    } catch (error) {
      res.status(200).json({ error: error.message });
    }
  } catch (err) {
    res.status(500).json({message: "An error occurred when getting the prompt list."})
    console.error(err);
  }
}