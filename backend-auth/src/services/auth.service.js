import ENV_CONFIG from "#server/configs/env.config";
import {
  generateAccessToken,
  generateRefreshToken,
} from "#server/utils/jwt.util";
import userModel from "#server/models/user.model";
import { addCookie } from "#server/utils/cookie.util";

export async function generateAuthTokensAndSetCookies(res, payload) {
  // generate token
  const access_token = generateAccessToken(payload);
  const refresh_token = generateRefreshToken(payload);

  // Đặt Access Token va Refresh Token vào cookie
  addCookie(res, "access_token", `Bearer ` + access_token, {
    maxAge: parseInt(ENV_CONFIG.JWT_SECRET_EXPIRES),
  });
  addCookie(res, "refresh_token", refresh_token, {
    maxAge: parseInt(ENV_CONFIG.JWT_SECRET_EXPIRES),
  });

  // Lưu Refresh Token vào database
  await userModel.findByIdAndUpdate(
    payload._id,
    {
      refreshToken: refresh_token,
    },
    { new: true }
  );

  return { access_token, refresh_token };
}
