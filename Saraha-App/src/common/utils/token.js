import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

export const accessKey = "access";
export const refreshKey = "refresh";
export const generateToken = ({ data, key, expiresIn, subject }) => {
  const token = jwt.sign(data, key, {
    expiresIn: expiresIn ?? (key === refreshKey ? "7d" : "1h"),
    issuer: "Saraha-App",
    ...(subject ? { subject } : {}),
  });
  return token;
};

export const verifyToken = (token, key) => {
  return jwt.verify(token, key);
};

export const createCredential = (user) => {
  const jti = randomUUID();
  return {
    accessToken: generateToken({
      data: { _id: user._id, jti },
      key: accessKey,
    }),
    refreshToken: generateToken({
      data: { _id: user._id, jti },
      key: refreshKey,
    }),
  };
};
