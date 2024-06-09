import { addMessageToChat, createNewChat, streamChat } from "services/api";
import { getInitialPrompt } from "services/prompt";

export const config = {
  runtime: "edge"
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

    if (chatId && !chatId.startsWith('new-')) {
      const body = {
        chatId,
        role: 'user',
        content: message,
      };
      const messageToChat = await addMessageToChat(req, body);
      const messageToChatJson = await messageToChat.json();
      chatMessages = messageToChatJson.chat.messages || [];
    } else {
      const newChat = await createNewChat(req, { message });
      const newChatJson = await newChat.json();
      chatId = newChatJson.chat._id;
      newChatId = newChatJson.chat._id;
      chatMessages = newChatJson.chat.messages || [];
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

    const initialPrompt = await getInitialPrompt(req, {});
    const initialPromptJson = await initialPrompt.json();
    messagesToInclude.reverse();

    const messages = [initialPromptJson, ...messagesToInclude];
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