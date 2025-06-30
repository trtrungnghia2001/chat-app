import ENV_CONFIG from "#server/configs/env.config";
import {
  signinFailedController,
  signinSuccessController,
} from "#server/controllers/passport.controller";
import express from "express";
import passport from "passport";

const passportRouter = express.Router();

passportRouter.get("/signin-success", signinSuccessController);
passportRouter.get("/signin-failed", signinFailedController);

// google
passportRouter.get("/google", passport.authenticate("google"));

passportRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: ENV_CONFIG.PASSPORT_REDIRECT_SUCCESS,
    failureRedirect: ENV_CONFIG.PASSPORT_REDIRECT_FAILED,
  })
);

export default passportRouter;
