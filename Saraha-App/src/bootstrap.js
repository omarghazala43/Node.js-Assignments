import DBconnection from "./DB/connection.js";
import express from "express";
import authRouter from "./modules/auth/auth.controller.js";
import { globalErrHandler } from "./common/response/global-error-handler.js";
import userRouter from "./modules/user/user.controller.js";
import { resolve } from "path";
import redisConnection from "./DB/redis.connection.js";
import { redisService } from "./common/service/redis.service.js";

async function bootstrap() {
  const app = express();
  await DBconnection();
  await redisConnection();

  app.use(express.json());

  app.use("/uploads", express.static(resolve("uploads")));

  app.get("/", (req, res) => {
    res.json({ message: "Hello" });
  });

  app.use("/auth", authRouter);
  app.use("/user", userRouter);

  app.use(globalErrHandler);

  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
}

export default bootstrap;
