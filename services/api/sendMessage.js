export default async function handler(body) {
  const response = await fetch(`/api/chat/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  return response;
}