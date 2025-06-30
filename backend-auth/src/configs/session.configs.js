import session from "express-session";
import ENV_CONFIG from "./env.config.js";

const SESSION_CONFIG = session({
  secret: ENV_CONFIG.JWT_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  proxy: true,
});

export default SESSION_CONFIG;
