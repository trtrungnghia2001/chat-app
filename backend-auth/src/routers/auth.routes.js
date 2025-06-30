import express from "express";
import { validateAuth } from "#server/middlewares/validation.middleware";
import { verifyAccessToken } from "#server/middlewares/auth.middleware";
import {
  schemaChangePassword,
  schemaForgotPassword,
  schemaResetPassword,
  schemaSignin,
  schemaSignup,
  schemaUpdateMe,
} from "#server/utils/auth.schema.util";
import {
  changePasswordController,
  forgotPasswordController,
  getMeController,
  refreshTokenController,
  resetPasswordController,
  signinController,
  signoutController,
  signupController,
  updateMeController,
} from "#server/controllers/auth.controller";
import upload from "#server/configs/multer.config";

const authRouter = express.Router();

authRouter.post(`/signup`, validateAuth(schemaSignup), signupController);

authRouter.post(`/signin`, validateAuth(schemaSignin), signinController);

authRouter.post(`/signout`, signoutController);

authRouter.get(`/get-me`, verifyAccessToken, getMeController);

authRouter.put(
  `/update-me`,
  verifyAccessToken,
  upload.single("file-avatar"),
  validateAuth(schemaUpdateMe),
  updateMeController
);

authRouter.post(
  `/change-password`,
  verifyAccessToken,
  validateAuth(schemaChangePassword),
  changePasswordController
);

authRouter.post(`/refresh-token`, refreshTokenController);

authRouter.post(
  `/forgot-password`,
  validateAuth(schemaForgotPassword),
  forgotPasswordController
);

authRouter.post(
  `/reset-password`,
  validateAuth(schemaResetPassword),
  resetPasswordController
);

export default authRouter;
