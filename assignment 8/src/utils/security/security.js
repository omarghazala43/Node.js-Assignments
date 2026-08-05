import bcrypt from "bcrypt";
import crypto from "crypto";
export const myEncryption = (plainText) => {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedText = cipher.update(plainText, "utf-8", "hex");
  encryptedText += cipher.final("hex");
  return encryptedText;
};

export const myHash = async (plainText) => {
  const hashedText = await bcrypt.hash(plainText, 10);
  return hashedText;
};
