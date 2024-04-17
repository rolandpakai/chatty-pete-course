export default async function handler(req, body) {
  const response = await fetch(`${req.headers.origin}/api/prompt/createNewPrompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: req.headers.cookie,
    },
    body: JSON.stringify(body)
  });
  
  return response;
}