import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

export const uploadToCloudinary = async (localImagePath) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!localImagePath) {
      throw new ApiError(500, "No image found in local to upload");
    }
    // uploading the image to cloudinary
    const uploadResult = await cloudinary.uploader.upload(localImagePath, {
      resource_type: "auto",
    });

    // file uploaded successfully
    return uploadResult;
  } catch (error) {
    // remove the local file in case of any error to upload on cloudinary
    fs.unlinkSync(localImagePath);
    throw new ApiError(500, error.message || "Error while uploading file");
  }
};
