import {v4 as uuid} from 'uuid';
import { getSession } from "lib/auth/auth";
import { insertOne } from 'services/db';

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const { message } = req.body; 

    if (typeof message !== "string" || message.length > 200) {
      res.status(422).json({
        message: "Message is required and must be less than 200 characters."
      });
      return;
    }
   
    const newUserMessage = {
      role: "user",
      content: message,
    };

    const chat = {
      _id: uuid(),
      userId: user.sub,
      messages: [newUserMessage],
      title: message,
    };

    await insertOne(chat);

    res.status(200).json({
      chat
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred when creating a new chat."
    });
  }
}