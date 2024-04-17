import { getSession } from "lib/auth/auth";
import { getAll } from 'services/db';

const AI_NAME = process.env.AI_NAME ?? 'LAISA';

export default async function handler(req, res) {
  try {
    //const { user } = await getSession(req, res);
    const {} = req.body; 

    const allPrompt = await getAll(process.env.COLLECTION_NAME_PROMPTS);
    let content = "";
    
    if (allPrompt) {
      const contents = [];

      allPrompt.forEach((prompt) => {
        const { content } = prompt;
        contents.push(content);
      });

      if (contents.length > 0) {
        content = `Here are some information about the Lightware Visual Engineering company: ${contents.join('\n')}`;
      }
    }

    const initialChatMessage = {
      role: "system",
      content:
      `Your name is ${AI_NAME} - Lightware AI Support Assistant. 
      Your are an AI chat assistant at Lightware Visual Engineering company. 
      An incredibly intelligent and quick-thinking AI, that always replies with an enthusiastic and positive energy. 
      ${content}
      Your response must be formatted as markdown.`,
    };

    res.status(200).json(initialChatMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred when creating a new prompt."
    });
  }
}