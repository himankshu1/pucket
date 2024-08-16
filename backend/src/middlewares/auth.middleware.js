import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

//* this will be used to check for an authorised user when client requests for any secured resource
export const verifyJWT = async (req, res, next) => {
  try {
    // checking in case of custom header/receiving cookies from mobile
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json(new ApiError(400, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json(new ApiError(401, "Invalid access token"));
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while verifying token"
    );
  }
};
