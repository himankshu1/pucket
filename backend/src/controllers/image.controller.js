import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export async function uploadImage(req, res) {
  try {
    // get the currently logged in user from the auth middleware (verify jwt)
    const loggedinUser = req.user;
    const localImagePath = req.file?.path;

    if (!localImagePath) {
      res.status(400).json(new ApiError(400, "Please provide an image"));
    }

    // upload to cloudinary
    const uploadResult = await uploadToCloudinary(localImagePath);

    // updating the user's uploaded images array
    loggedinUser.uploadedImages.push(uploadResult.secure_url);

    // saving to the database
    await loggedinUser.save({ validateBeforeSave: false });

    // sending response to client
    return res.status(200).json(
      new ApiSuccess(
        200,
        {
          uploadedImage: uploadResult.secure_url,
        },
        "Image uploaded successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, error?.message || "Couldn't upload the image");
  }
}
