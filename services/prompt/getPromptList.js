export default async function handler() {
  const response = await fetch('/api/prompt/getPromptList', {
    method: 'GET',
  });

  return response;
}
