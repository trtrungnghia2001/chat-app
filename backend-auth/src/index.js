import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import { connectMongoDB } from "./configs/database.config.js";
import CORS_CONFIG from "./configs/cors.config.js";
import ENV_CONFIG from "./configs/env.config.js";
import authRouter from "./routers/auth.routes.js";
import { handleError } from "./utils/response.util.js";
import passportRouter from "./routers/passport.routes.js";
import passportConfig from "./configs/passport.config.js";
import SESSION_CONFIG from "./configs/session.configs.js";
import { connectIo } from "./socket/chat.js";
import chatRouter from "./routers/chat.routes.js";
import { verifyAccessToken } from "./middlewares/auth.middleware.js";

connectMongoDB();
connectIo();

export const app = express();
app.use(CORS_CONFIG);
app.use(cookieParser());
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(SESSION_CONFIG);
app.use(passport.initialize());
app.use(passport.session());

app.listen(ENV_CONFIG.PORT, function () {
  console.log(`Server is running on port:: `, ENV_CONFIG.PORT);
});

// router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth/passport", passportRouter);
app.use("/api/v1/chat", verifyAccessToken, chatRouter);

app.use(handleError);
