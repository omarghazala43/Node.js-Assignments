import { Router } from "express";
import { successResponse } from "../../common/response/success-response.js";
import { auth, authorization } from "../../middleware/auth.middleware.js";
import { Role } from "../../common/enums/role.js";
import {
  createAccessToken,
  getProfile,
  logOut,
  updateUser,
  updateUserProfile,
} from "./user.service.js";
import { validate } from "../../middleware/validator.middleware.js";
import { updateUserImageSchema, updateUserSchema } from "./user.validation.js";
import localUpload, { fileValidation } from "../../common/utils/multer.js";

const userRouter = Router();

userRouter.get("/profile", auth, async (req, res) => {
  const user = await getProfile(req.user._id);
  return successResponse({ res, data: user });
});

userRouter.put(
  "/",
  auth,
  authorization(Role.USER),
  localUpload({ fileValidation: fileValidation.image, maxSize: 5 }).single(
    "profile",
  ),
  validate(updateUserImageSchema),
  async (req, res) => {
    const updated = await updateUserProfile(req.user._id, req.file);
    return successResponse({ res, data: updated });
  },
);

userRouter.put(
  "/:userId",
  auth,
  authorization(Role.ADMIN),
  validate(updateUserSchema),
  async (req, res) => {
    const updated = await updateUser(req.params.userId, req.body);
    return successResponse({ res, data: updated });
  },
);

userRouter.patch("/logout", auth, async (req, res) => {
  await logOut(
    req.user._id,
    req.body.flag,
    req.decodedToken.jti,
    req.decodedToken.iat,
  );
  return successResponse({
    res,
    message: "Logged out successfully",
  });
});

userRouter.post("/get-access-token", async (req, res) => {
  const { token } = req.body;

  const accessToken = await createAccessToken(token);

  return successResponse({
    res,
    data: { accessToken },
  });
});

export default userRouter;
