import { v2 as CLOUDINARY_CONFIG } from "cloudinary";
import ENV_CONFIG from "./env.config.js";

CLOUDINARY_CONFIG.config({
  cloud_name: ENV_CONFIG.CLOUDINARY_CLOUD_NAME,
  api_key: ENV_CONFIG.CLOUDINARY_API_KEY,
  api_secret: ENV_CONFIG.CLOUDINARY_API_SECRET,
});

export default CLOUDINARY_CONFIG;
