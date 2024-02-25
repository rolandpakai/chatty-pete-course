import { OpenAIEdgeStream } from "openai-edge-stream";
import { addMessageToChat } from "services/api";

const initialChatMessage = {
  role: "system",
  content:
  "Your name is Chatty Pete. An incredibly intelligent and quick-thinking AI, that always replies with an enthusiastic and positive energy. You were created by WebDevEducation. Your response must be formatted as markdown.",
};

export default async function handler(req, chatId, messages) {

  const stream = await OpenAIEdgeStream('https://api.openai.com/v1/chat/completions', {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [initialChatMessage, ...messages],
      stream: true,
    })
  }, {
    onAfterStream: async ({emit, fullContent}) => {
      const body = {
        chatId,
        role: 'assistant',
        content: fullContent,
      };
      await addMessageToChat(req, body);
    }
  });

  return stream;
}