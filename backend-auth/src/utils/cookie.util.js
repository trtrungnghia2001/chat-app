import ENV_CONFIG from "#server/configs/env.config";

const defaultCookieOptions = {
  httpOnly: ENV_CONFIG.IS_PRODUCTION,
  secure: true,
  sameSite: "None", // Rất quan trọng cho cross-origin
};

export function clearCookie(res, name_cookie, options) {
  res.clearCookie(name_cookie, {
    ...defaultCookieOptions,
    ...options,
  });
}

export function addCookie(res, name_cookie, payload, options) {
  res.cookie(name_cookie, payload, {
    ...defaultCookieOptions,
    ...options,
  });
}
