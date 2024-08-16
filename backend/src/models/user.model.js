import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username must be unique"],
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "full name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email must be unique"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      min: [8, "minimum 8 characters are required"],
    },
    userType: {
      type: String,
      required: [
        true,
        "user type is required. Please choose 'buyer' or 'seller'",
      ],
      enum: ["buyer", "seller"],
    },
    uploadedImages: [String],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// checking if only the password is changed before saving in user's collection in case any of these fields changes then the password will be hashed again and saved into collection.
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    console.log(
      `error while hashing the password before saving into db: ${error}`
    );
    throw new Error(
      `error while hashing the password before saving into db: ${error}`
    );
  }
});

// method check if the password is correct or not
userSchema.methods.isPasswordCorrect = async function (password) {
  // returns true or false
  return await bcrypt.compare(password, this.password);
};

// access token method
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// refresh token method
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = model("User", userSchema);
