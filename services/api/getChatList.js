export default async function handler() {
  const response = await fetch('/api/chat/getChatList', {
    method: 'GET',
  });

  return response;
}
