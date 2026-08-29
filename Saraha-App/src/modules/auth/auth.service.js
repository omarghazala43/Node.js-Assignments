import { System } from "../../common/enums/system.js";
import {
  BadRequestError,
  NotFoundError,
} from "../../common/response/error-response.js";
import { hash, compare } from "../../common/utils/hash.js";
import { createCredential } from "../../common/utils/token.js";
import User from "../../DB/models/user.model.js";
import { create, findOne } from "../../DB/repository.js";

export const signUp = async (input) => {
  const existUser = await findOne({
    model: User,
    filter: { email: input.email },
  });

  if (existUser) throw BadRequestError({ message: "User exist" });

  input.password = await hash(input.password);
  const user = await create({ model: User, data: input });

  return user;
};

export const login = async (input) => {
  const existUser = await findOne({
    model: User,
    filter: { email: input.email },
  });
  if (!existUser) throw NotFoundError({ message: "Invalid email or password" });

  if (existUser.provider === System.GMAIL)
    throw BadRequestError({ message: "Login with gmail" });

  const checkPasswprd = await compare(input.password, existUser.password);

  if (!checkPasswprd)
    throw BadRequestError({ message: "Invalid email or password" });

  return createCredential(existUser);
};
