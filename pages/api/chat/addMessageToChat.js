import { findOneAndUpdate } from "services/db";

export default async function handler(req, res) {
  try {
    const { chatId, role, content } = req.body;

    if (typeof content !== "string" ) {
      res.status(422).json({
        message: "Content is required."
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
    
    const chat = await findOneAndUpdate(process.env.COLLECTION_NAME_CHATS, messages);

    res.status(200).json({
      chat
    });

  } catch (err) {
    res.status(500).json({message: "An error occurred when adding a message to a chat."});
    console.error(err);
  }
}