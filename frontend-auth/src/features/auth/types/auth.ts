import type { ResponseSuccessType } from "@/shared/types/response";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  gender: string;
  avatar: string;
  phoneNumber: string;
  address: string;
  birthday: string;
  work: string;
  education: string;
  bio: string;
  link_website: string;
}

export interface ISignupData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}
export interface ISigninData {
  email: string;
  password: string;
}
export interface IForgotPasswordData {
  email: string;
}
export interface IResetPasswordData {
  token: string;
  password: string;
  confirm_password: string;
}
export interface IChangePasswordData {
  password: string;
  confirm_password: string;
}

export interface IAuthStore {
  // --- State ---
  user: null | IUser;
  isAuthenticated: boolean;

  // --- Actions ---
  signup: (
    data: ISignupData
  ) => Promise<ResponseSuccessType<IUser> | undefined>;
  signin: (
    data: ISigninData
  ) => Promise<ResponseSuccessType<ISigninResponseData> | undefined>;
  signout: () => Promise<ResponseSuccessType | undefined>;
  forgotPassword: (
    data: IForgotPasswordData
  ) => Promise<ResponseSuccessType | undefined>;
  resetPassword: (
    data: IResetPasswordData
  ) => Promise<ResponseSuccessType | undefined>;
  signinWithSocialMedia: (social: SocialMediaType) => void;
  signinWithSocialMediaSuccess: () => Promise<
    ResponseSuccessType<ISigninResponseData> | undefined
  >;
  updateMe: (
    data: Partial<IUser>
  ) => Promise<ResponseSuccessType<IUser> | undefined>;
  getMe: () => Promise<ResponseSuccessType<IUser> | undefined>;
  changePassword: (
    data: IChangePasswordData
  ) => Promise<ResponseSuccessType | undefined>;
}

export interface ISigninResponseData {
  access_token: string;
  user: IUser;
}

export type SocialMediaType = "google" | "github";
