export const generateSecret = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 32;
  let secret = "";
  for (let i = 0; i < length; i++) {
    secret += characters[Math.floor(Math.random() * characters.length)];
  }
  return secret;
};
