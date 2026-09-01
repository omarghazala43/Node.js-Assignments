import { NotFoundError } from "../../common/response/error-response.js";
import { redisService, tokenKey } from "../../common/service/redis.service.js";
import {
  createCredential,
  refreshKey,
  verifyToken,
} from "../../common/utils/token.js";
import Token from "../../DB/models/token.model.js";
import User from "../../DB/models/user.model.js";
import { create, findOne, updateOne } from "../../DB/repository.js";

export const getProfile = async (_id) => {
  const userProfile = await findOne({ model: User, filter: { _id } });
  return {
    ...userProfile,
    profileImage: `http://localhost:8000/${userProfile.profileImage}`,
  };
};

export const updateUser = async (_id, data) => {
  const user = await findOne({ model: User, filter: { _id } });

  if (!user) {
    throw NotFoundError({ message: "User not found" });
  }

  const updated = await updateOne({ model: User, filter: { _id }, data });
  return updated;
};

export const updateUserProfile = async (_id, file) => {
  const user = await findOne({ model: User, filter: { _id } });

  if (!user) {
    throw NotFoundError({ message: "User not found" });
  }

  const updated = await updateOne({
    model: User,
    filter: { _id },
    data: { profileImage: file.finalPath },
  });
  return updated;
};

export const logOut = async (_id, flag, jti, iat) => {
  if (flag === "all") {
    await updateOne({
      model: User,
      filter: { _id },
      data: { $set: { changeCredential: new Date() } },
    });


  } else {
    await redisService.set({
      key: tokenKey(_id, jti),
      val: jti,
      ttl: iat + 60 * 60,
    });
  }
};

export const createAccessToken = async (refreshToken) => {
  const decoded = verifyToken(refreshToken, refreshKey);

  const user = await findOne({ model: User, filter: { _id: decoded._id } });

  const { accessToken } = createCredential(user);

  return accessToken;
};


