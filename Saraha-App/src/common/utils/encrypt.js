import crypto from "crypto";

const key = Buffer.from(
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  "hex",
);
const iv = crypto.randomBytes(16);
export const encrypt = (plainText) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedText = cipher.update(plainText, "utf-8", "hex");
  encryptedText += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedText}}`;
};

export const decrypt = (encryptedText) => {
  const [ivhex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivhex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decryptedText = decipher.update(encryptedText, "hex", "utf-8");
  decryptedText += decipher.final("utf-8");
  return decryptedText;
};
