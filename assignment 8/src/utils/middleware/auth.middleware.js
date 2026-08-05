import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).json({ message: "Token is required" });
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, "omar");

    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
