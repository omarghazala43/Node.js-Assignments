import { Router } from "express";
import { login, signUp } from "./auth.service.js";
import { successResponse } from "../../common/response/success-response.js";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { create, findOne } from "../../DB/repository.js";
import User from "../../DB/models/user.model.js";
import { createCredential } from "../../common/utils/token.js";
import { System } from "../../common/enums/system.js";
import { BadRequestError } from "../../common/response/error-response.js";
import { validate } from "../../middleware/validator.middleware.js";
import { loginSchema, signUpSchema } from "./auth.validators.js";

const authRouter = Router();

authRouter.post("/register", validate(signUpSchema), async (req, res) => {
  const user = await signUp(req.body);
  return successResponse({
    res,
    status: 201,
    data: user,
    message: "User added successfully",
  });
});

authRouter.post("/login", validate(loginSchema), async (req, res) => {
  const user = await login(req.body);
  return successResponse({
    res,
    data: user,
    message: "User login successfully",
  });
});

let REDIRECT_URI = "http://localhost:8000/auth/google/callback";
let CLIENT_ID =
  "15133032516-hsqbau3n9snjc2fufoa7ucspkqdpbceb.apps.googleusercontent.com";
let CLIENT_SECRET = "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";
authRouter.get("/google", (req, res) => {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&access_type=offline` +
    `&prompt=select_account`;

  res.redirect(url);
});

authRouter.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  const data = await axios.post("https://oauth2.googleapis.com/token", {
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const { access_token, id_token } = data.data;

  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (payload && payload.email_verified) {
    let existUser = await findOne({
      model: User,
      filter: { email: payload.email },
    });

    if (!existUser) {
      existUser = await create({
        model: User,
        data: {
          email: payload.email,
          fname: payload.given_name,
          lname: payload.family_name,
          provider: System.GMAIL,
        },
      });
    }

    const { accessToken, refreshToken } = createCredential(existUser);

    return successResponse({
      res,
      data: { accessToken, refreshToken },
      message: "User login successfully",
    });
  } else {
    throw BadRequestError({ message: "Invalid email" });
  }

  res.json({ message: "Hello from callback API" });
});

export default authRouter;
