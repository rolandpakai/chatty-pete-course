import { addMessageToChat, createNewChat, streamChat } from "services/api";

const AI_NAME = process.env.AI_NAME ?? 'LAISA';

export const config = {
  runtime: "edge"
};

const initialChatMessage = {
  role: "system",
  content:
  `Your name is ${AI_NAME} - Ligthware AI Support Assistant. Your are an AI chat assistant at Lightware Visual Engineering company. An incredibly intelligent and quick-thinking AI, that always replies with an enthusiastic and positive energy. You were created by WebDevEducation. Your response must be formatted as markdown.`,
};

export default async function handler(req) {
  try {
    const { chatId: chatIdFromParam, message } = await req.json();
    let chatId = chatIdFromParam;
    let newChatId;
    let chatMessages = [];

    if (typeof message !== "string" || message.length > 200) {
      return new Response({
        message: 'Message is required and must be less than 200 characters.',
      }, {
        status: 422
      });
    }

    if (chatId) {
      const body = {
        chatId,
        role: 'user',
        content: message,
      };
      const response = await addMessageToChat(req, body);
      const json = await response.json();
      chatMessages = json.chat.messages || [];
    } else {
      const response = await createNewChat(req, { message });
      const json = await response.json();
      chatId = json.chat._id;
      newChatId = json.chat._id;
      chatMessages = json.chat.messages || [];
    }

    const messagesToInclude = [];
    chatMessages.reverse();
    let usedTokens = 0;

    for (let chatMessage of chatMessages) {
      const messageTokens = chatMessage.content.length / 4;
      usedTokens += messageTokens;

      if (usedTokens <= 2000) {
        messagesToInclude.push(chatMessage);
      } else {
        break;
      }
    }

    messagesToInclude.reverse();

    const messages = [initialChatMessage, ...messagesToInclude];

    const stream = await streamChat(req, chatId, messages);

    return new Response(stream);
  } catch (err) {
    return new Response({
      message: 'An error occurred in sendMessage'
    }, {
      status: 500,
    })
  }
}