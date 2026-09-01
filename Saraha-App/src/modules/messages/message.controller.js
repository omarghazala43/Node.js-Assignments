import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { getMessages } from "./message.service.js";
import { successResponse } from "../../common/response/success-response.js";

const messageRouter = Router({
  mergeParams: true,
});

messageRouter.get("/test", auth, async (req, res) => {
  console.log({ params: req.params });
  const messages = await getMessages(req.user._id);
  return successResponse({ res, data: "Messages" });
});

export default messageRouter;
