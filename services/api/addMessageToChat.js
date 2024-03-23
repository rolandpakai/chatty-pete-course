export default async function handler(req, body) {
  const response = await fetch(`${req.headers.get('origin')}/api/chat/addMessageToChat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: req.headers.get('cookie'),
    },
    body: JSON.stringify(body)
  });
  
  return response;
}