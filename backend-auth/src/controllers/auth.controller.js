import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import userModel from "#server/models/user.model";
import { handleResponse } from "#server/utils/response.util";
import { generateAuthTokensAndSetCookies } from "#server/services/auth.service";
import ENV_CONFIG from "#server/configs/env.config";
import { clearCookie } from "#server/utils/cookie.util";
import sendEmail from "#server/services/email.service";
import {
  deleteImageToCloudinary,
  uploadImageToCloudinary,
} from "#server/services/cloudinary.service";

export async function signupController(req, res, next) {
  try {
    const body = req.body;
    // check exists user
    const userExists = await userModel.findOne({
      email: body.email,
    });
    if (userExists) {
      throw createHttpError.Conflict("User already exists");
    }

    const newUser = await userModel.create(body);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      message: `Signup successfully!`,
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
}
export async function signinController(req, res, next) {
  try {
    const body = req.body;
    // check exists user
    const userExists = await userModel
      .findOne({
        email: body.email,
      })
      .select(["+password"]);

    if (!userExists) {
      throw createHttpError.Conflict("Invalid email or password");
    }
    // compare password
    const isMatchPassword = await userExists.isPasswordMatch(body.password);
    if (!isMatchPassword) {
      throw createHttpError.NotFound("Invalid email or password");
    }

    const payload = {
      _id: userExists._id,
      email: userExists.email,
      role: userExists.role,
    };
    const { access_token } = await generateAuthTokensAndSetCookies(
      res,
      payload
    );

    const { password, ...other } = userExists._doc;

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: `Signin successfully!`,
      data: {
        user: other,
        access_token: access_token,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function signoutController(req, res, next) {
  try {
    const refresh_token = req.cookies.refresh_token;
    // clear token from cookie
    clearCookie(res, "access_token");
    clearCookie(res, "refresh_token");
    clearCookie(res, "connect.sid");

    // remove token from database
    await userModel.findOneAndUpdate(
      { refreshToken: refresh_token },
      {
        refreshToken: "",
      }
    );

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: `Signout successfully!`,
      data: null,
    });
  } catch (error) {
    next(error);
  }
}
export async function getMeController(req, res, next) {
  try {
    const user = req.user;
    const getUser = await userModel.findById(user._id);

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: `Get me successfully!`,
      data: getUser,
    });
  } catch (error) {
    next(error);
  }
}
export async function updateMeController(req, res, next) {
  try {
    const user = req.user;
    const body = req.body;
    const file = req.file;

    let avatar = body.avatar;
    // upload file
    if (file) {
      avatar = (await uploadImageToCloudinary(file)).url;
      await deleteImageToCloudinary(body.avatar);
    }

    const userUpdate = await userModel.findByIdAndUpdate(
      user._id,
      { ...body, avatar },
      { new: true }
    );

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: `User updated successfully!`,
      data: userUpdate,
    });
  } catch (error) {
    next(error);
  }
}
export async function changePasswordController(req, res, next) {
  try {
    const user = req.user;
    const { password } = req.body;

    const userExists = await userModel.findById(user._id);
    if (!userExists) {
      throw new Error("User not found");
    }

    userExists.password = password;
    await userExists.save();

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: `Password changed successfully!`,
    });
  } catch (error) {
    next(error);
  }
}
export async function refreshTokenController(req, res, next) {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      // Nếu không tìm thấy refresh token trong cookie, user cần đăng nhập lại.
      throw createHttpError.Unauthorized(
        "Refresh Token not found. Please log in again."
      );
    }

    const decoded = await jwt.verify(
      refresh_token,
      ENV_CONFIG.JWT_REFRESH_SECRET_KEY
    );

    const user = await userModel.findById(decoded._id).select(["refreshToken"]);

    if (!user || user.refreshToken !== refresh_token) {
      throw createHttpError.Unauthorized(
        "Invalid Refresh Token or Token revoked. Please log in again."
      );
    }

    const payload = { _id: user._id, email: user.email, role: user.role };

    const { access_token } = await generateAuthTokensAndSetCookies(
      res,
      payload
    );

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: `Refresh token successfully!`,
      data: access_token,
    });
  } catch (error) {
    // clear token from cookie
    clearCookie(res, "access_token");
    clearCookie(res, "refresh_token");
    clearCookie(res, "connect.sid");

    next(error);
  }
}
export async function forgotPasswordController(req, res, next) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return handleResponse(res, {
        status: StatusCodes.OK,
        message: `If a user with that email exists, a password reset email has been sent.`,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1 giờ

    user.resetPasswordToken = resetToken; // Bạn cần thêm trường này vào user schema
    user.resetPasswordExpires = resetTokenExpires; // Bạn cần thêm trường này vào user schema
    await user.save();

    // --- Gửi email cho người dùng ---
    const resetUrl = `${ENV_CONFIG.URL_CLIENT}/reset-password?token=${resetToken}`; // URL của frontend để đặt lại mật khẩu
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      templateName: "password-reset.ejs", // Tên template
      templateData: { resetUrl: resetUrl }, // Dữ liệu truyền vào template
    });

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: `If a user with that email exists, a password reset email has been sent.`,
    });
  } catch (error) {
    next(error);
  }
}
export async function resetPasswordController(req, res, next) {
  try {
    const { token, password } = req.body;

    // Tìm người dùng bằng token và kiểm tra thời gian hết hạn
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      throw createHttpError.BadRequest(
        "Password reset token is invalid or has expired."
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: `Password has been reset successfully!`,
    });
  } catch (error) {
    next(error);
  }
}
