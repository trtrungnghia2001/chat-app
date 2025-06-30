import { GENDER, ROLE } from "#server/constants/user.constant";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    name: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    avatar: String,
    phoneNumber: String,
    address: String,
    birthday: String,
    work: String,
    education: String,
    bio: String,
    link_website: String,

    // passport
    providerGoogle: {
      type: String,
      unique: true,
    },

    // token
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Number, select: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // Chỉ hash mật khẩu nếu nó đã được sửa đổi hoac tao
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isPasswordMatch = async function (plainPassword) {
  if (typeof plainPassword !== "string" || typeof this.password !== "string") {
    console.error(
      "Type Error: plainPassword or hashedPassword is not a string"
    );
    return false; // Hoặc ném một lỗi cụ thể nếu bạn muốn
  }
  return await bcrypt.compare(plainPassword, this.password);
};

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
