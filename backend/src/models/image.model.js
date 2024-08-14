import { Schema, model } from "mongoose";

const imageSchema = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    imageURL: String, // or use a reference to an image storage service
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    purchaseDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Image = model("Image", imageSchema);
