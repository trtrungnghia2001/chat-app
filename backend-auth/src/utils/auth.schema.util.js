import Joi from "joi";

export const schemaSignup = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(new RegExp(`@gmail.com`)).email().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string().valid(Joi.ref("password")).required(),
});
export const schemaSignin = Joi.object({
  email: Joi.string().pattern(new RegExp(`@gmail.com`)).email().required(),
  password: Joi.string().required(),
});
export const schemaChangePassword = Joi.object({
  password: Joi.string().required(),
  confirm_password: Joi.string().valid(Joi.ref("password")).required(),
});
export const schemaForgotPassword = Joi.object({
  email: Joi.string().pattern(new RegExp(`@gmail.com`)).email().required(),
});
export const schemaResetPassword = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string().valid(Joi.ref("password")).required(),
});
export const schemaUpdateMe = Joi.object({
  name: Joi.string().optional(),
  gender: Joi.string().optional(),
  avatar: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  address: Joi.string().optional(),
  birthday: Joi.string().optional(),
  work: Joi.string().optional(),
  education: Joi.string().optional(),
  bio: Joi.string().optional(),
  link_website: Joi.string().optional(),
});
