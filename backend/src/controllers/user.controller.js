import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import jwt from "jsonwebtoken";

//* generating access and refresh token whenever needed
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const access_token = await user.generateAccessToken();
    const refresh_token = await user.generateRefreshToken();

    // saving the refresh token into the db
    user.refreshToken = await refresh_token;

    // blocking mongodb to save without validating if other fields in the schema are present while saving so that it doesn't complain while saving refresh token
    await user.save({ validateBeforeSave: false });

    return { access_token, refresh_token };
  } catch (error) {
    throw new ApiError(500, "couldn't generate access and refresh tokens");
  }
};

//* user register method
//TODO: Need to handle the username field if already exists
export async function registerUser(req, res) {
  // get fields from request body
  const { username, fullName, email, password, userType } = req.body;

  //   console.log(username, fullName, email, password, userType);

  // validate all the fields
  if (
    [username, fullName, email, password, userType].some(
      (field) =>
        field?.trim() === null ||
        field?.trim() === undefined ||
        field?.trim() === ""
    )
  ) {
    res.json(new ApiError(400, "All fields are required"));
  }

  // check if the user exists
  const already_existed_user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (already_existed_user) {
    return res.json(
      new ApiError(409, "User with username or email already exists")
    );
  }

  // create user in db
  const created_user = await User.create({
    username,
    fullName,
    email,
    password,
    userType,
  });

  // generate access and refresh tokens for created user
  const { access_token, refresh_token } = await generateAccessAndRefreshTokens(
    created_user._id
  );

  const loggedIn_user = await User.findById(created_user._id).select(
    "-password -refreshToken"
  );

  // respond with user instance created in db and cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", access_token, options)
    .cookie("refreshToken", refresh_token, options)
    .json(
      new ApiSuccess(
        200,
        { user: loggedIn_user, access_token, refresh_token },
        "User created and loggedin successfully"
      )
    );
}

//* user login method
export async function loginUser(req, res) {
  const { email, password } = req.body;

  // validating the fields
  if (!email && !password) {
    return res.status(400).json(new ApiError(400, "all fields are required"));
  }

  // checking if user exists with username or password
  const isUserFound = await User.findOne({ email });

  if (!isUserFound) {
    return res.status(404).json(new ApiError(404, "user not found"));
  }

  // checking if password is correct
  const isPasswordCorrect = await isUserFound.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiError(400, "email or password is not correct"));
  }

  // generating access and refresh tokens
  const { access_token, refresh_token } = await generateAccessAndRefreshTokens(
    isUserFound._id
  );

  // getting the currently loggedin user from db with filter
  const loggedInUser = await User.findById(isUserFound._id).select(
    "-password -refreshToken"
  );

  // responding with the successful login response
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", access_token, options)
    .cookie("refreshToken", refresh_token, options)
    .json(
      new ApiSuccess(
        200,
        {
          user: loggedInUser,
          access_token,
          refresh_token,
        },
        "user signed in successfully"
      )
    );
}

//* user logout method
export async function logoutUser(req, res) {
  const loggedOutUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiSuccess(200, loggedOutUser, "user logged out successfully"));
}

//* regenerate access & refresh token when access token is expired (refresh token is saved in the cookies)
export async function regenerateAccessToken(req, res) {
  try {
    // get refresh token. handle if not received
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(400).json(new ApiError(400, "Unauthorized request"));
    }

    // decrypting the token with jwt and finding the user in db
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      return res.status(400).json(new ApiError(400, "Invalid token"));
    }

    // comparing the incoming refresh token from client and in the db
    if (incomingRefreshToken !== user?.refreshToken) {
      // user is not verified
      res
        .status(400)
        .json(new ApiError(400, "Refresh token not matched or expired"));
    }

    // generating new access & refresh tokens
    const { access_token, refresh_token } =
      await user.generateAccessAndRefreshTokens(user._id);

    // defining cookies options
    const options = {
      httpOnly: true,
      secure: true,
    };

    // sending response to client
    return res
      .status(200)
      .cookie("accessToken", access_token, options)
      .cookie("refreshToken", refresh_token, options)
      .json(
        new ApiSuccess(
          200,
          {
            access_token,
            refresh_token,
          },
          "regenerated access token successfully"
        )
      );
  } catch (error) {
    // catch exception
    throw new ApiError(
      500,
      error?.message || "Error while generating access token"
    );
  }
}
