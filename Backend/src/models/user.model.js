import bcrypt from "bcrypt";
import mongoose from "mongoose";
import JWT from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:"https://res-console.cloudinary.com/defgxc2iy/media_explorer_thumbnails/3fb81eabb1dd4f7b4ec41476f41d01da/detailed"
    },
    refreshToken: {
      type: String,
    },
    status: {
      type: String,
      default: "Available",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});
userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};
userSchema.methods.generateAccessTokens = async function () {
  try {
    return JWT.sign(
      {
        _id: this._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  } catch (error) {
    return error;
  }
};
userSchema.methods.generateRefreshTokens = async function () {
  try {
    return JWT.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  } catch (error) {
    return error;
  }
};

const User = mongoose.model("User", userSchema);

export default User;
