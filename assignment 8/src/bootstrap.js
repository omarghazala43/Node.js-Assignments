import express from "express";
import DBconnection from "./DB/connection.js";
import userRouter from "./modules/users/users.controller.js";
import notesRouter from "./modules/notes/notes.controller.js";

async function bootstrap() {
  const app = express();

  await DBconnection();
  app.use(express.json());
  app.use("/users", userRouter);
  app.use("/notes", notesRouter);

  app.listen(8000, () => {
    console.log("Server running on port 8000");
  });
}

export default bootstrap;
