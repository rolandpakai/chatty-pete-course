import { OpenAIEdgeStream } from "openai-edge-stream"; 

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

    const initialChatMessage = {
      role: "system",
      content:
      "Your name is Chatty Pete. An incredibly intelligent and quick-thinking AI, that always replies with an enthusiastic and positive energy. You were created by WebDevEducation. Your response must be formatted as markdown.",
    };

    if (chatId) {
      const response = await fetch(`${req.headers.get('origin')}/api/chat/addMessageToChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: req.headers.get('cookie'),
        },
        body: JSON.stringify({
          chatId,
          role: 'user',
          content: message,
        })
      });

      const json = await response.json();
      chatMessages = json.chat.messages || [];
    } else {
      const response = await fetch(`${req.headers.get('origin')}/api/chat/createNewChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: req.headers.get('cookie'),
        }, 
        body: JSON.stringify({
          message,
        })
      });

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

    const stream = await OpenAIEdgeStream('https://api.openai.com/v1/chat/completions', {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [initialChatMessage, ...messagesToInclude],
        stream: true,
      })
    }, {
      onBeforeStream: ({emit}) => {
        if (newChatId) {
          emit(newChatId, 'newChatId');
        }
      },
      onAfterStream: async ({emit, fullContent}) => {
        await fetch(`${req.headers.get("origin")}/api/chat/addMessageToChat`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            cookie: req.headers.get('cookie'),
          },
          body: JSON.stringify({
            chatId,
            role: 'assistant',
            content: fullContent,
          })
        });
      }
    });

    return new Response(stream);
  } catch (err) {
    return new Response({
      message: 'An error occurred in sendMessage'
    }, {
      status: 500,
    })
  }
}