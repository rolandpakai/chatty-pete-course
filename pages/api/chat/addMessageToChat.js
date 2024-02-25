import { findOneAndUpdate } from "services/db";

export default async function handler(req, res) {
  try {
    const { chatId, role, content } = req.body;

    if (typeof content !== "string" || content.length > 200) {
      res.status(422).json({
        message: "Content is required and must be less than 200 characters."
      });
      return;
    }

    if (!(role === 'user' || role === 'assistant')) {
      res.status(422).json({
        message: "Role must be either user or assistant."
      });
      return;
    }

    const messages = {
      _id: chatId, 
      messages: {
        role,
        content,
      }
    };

    const chat = await findOneAndUpdate(messages);

    res.status(200).json({
      chat
    });

  } catch (err) {
    res.status(500).json({message: "An error occurred when adding a message to a chat."});
    console.error(err);
  }
}