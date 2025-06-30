import ENV_CONFIG from "#server/configs/env.config";
import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  return jwt.sign(
    { ...payload },
    ENV_CONFIG.JWT_SECRET_KEY, // Khóa bí mật cho Access Token
    {
      expiresIn: parseInt(ENV_CONFIG.JWT_SECRET_EXPIRES), // Thời gian hết hạn Access Token
    }
  );
};
export const generateRefreshToken = (payload) => {
  return jwt.sign(
    { ...payload },
    ENV_CONFIG.JWT_REFRESH_SECRET_KEY, // Khóa bí mật riêng cho Refresh Token
    {
      expiresIn: parseInt(ENV_CONFIG.JWT_REFRESH_SECRET_EXPIRES), // Thời gian hết hạn Refresh Token (dài hơn)
    }
  );
};
