import Message from "../../DB/models/message.model.js";
import { findAll } from "../../DB/repository.js";

export const getMessages = async (recieverId) => {
  const messages = await findAll({ model: Message, filter: { recieverId } });

  return messages
};
