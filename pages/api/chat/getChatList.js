import { getSession } from "@auth0/nextjs-auth0";
import { getAll } from 'services/db';

export default async function handle(req, res) {
  try {
    try {
      const { user } = await getSession(req, res);
      const chats = await getAll({
        userId: user.sub,
      });
      res.status(200).json({ chats });
    } catch (error) {
      res.status(200).json({ error: error.message });
    }
  } catch (err) {
    res.status(500).json({message: "An error occurred when getting the chat list."})
    console.error(err);
  }
}