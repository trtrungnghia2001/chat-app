import { generateAuthTokensAndSetCookies } from "#server/services/auth.service";
import { handleResponse } from "#server/utils/response.util";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

export async function signinSuccessController(req, res, next) {
  try {
    const user = req.user;

    if (!user) {
      throw createHttpError.Unauthorized(
        "User not authenticated for signin-success API."
      );
    }

    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const { access_token } = await generateAuthTokensAndSetCookies(
      res,
      payload
    );

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: `Google signin successfully!`,
      data: {
        user,
        access_token,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function signinFailedController(req, res, next) {
  try {
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: `Google signin failed!`,
    });
  } catch (error) {
    next(error);
  }
}
