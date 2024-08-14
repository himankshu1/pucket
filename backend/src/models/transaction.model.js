import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: "User" },
  seller: { type: Schema.Types.ObjectId, ref: "User" },
  image: { type: Schema.Types.ObjectId, ref: "Image" },
  purchaseDate: { type: Date, default: Date.now },
  price: Number,
});

export const Transaction = model("Transaction", transactionSchema);
