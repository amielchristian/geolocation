export const getMessage = async () => {
  const response = await fetch('/api');
  return await response.json();
};
