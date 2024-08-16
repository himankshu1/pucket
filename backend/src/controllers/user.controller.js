import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";

//* generating access and refresh token whenever needed
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const access_token = user.generateAccessToken();
    const refresh_token = user.generateRefreshToken();

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
    res.json(new ApiError(409, "User with username or email already exists"));
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
  const { username, email, password } = req.body;

  // validating the fields
  if (!username && !email) {
    return res
      .status(400)
      .json(new ApiError(400, "username or email and password is required"));
  }

  // checking if user exists with username or password
  const isUserFound = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!isUserFound) {
    return res.status(404).json(new ApiError(404, "user not found"));
  }

  // checking if password is correct
  const isPasswordCorrect = await isUserFound.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiError(400, "email/username or password is not correct"));
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
