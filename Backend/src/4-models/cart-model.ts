import mongoose from "mongoose";
import { UserModel } from "./user-model";

// 1. Model interface:
export interface ICartModel extends mongoose.Document {
  // No need to specify _id Primary Key
  userId: mongoose.Schema.Types.ObjectId; // Foreign Key
  creationDate: mongoose.Schema.Types.Date;
}

// 2. Model Schema:
export const CartSchema = new mongoose.Schema<ICartModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    creationDate: {
      type: mongoose.Schema.Types.Date,
    },
  },
  {
    versionKey: false, // Don't add __v field
    toJSON: { virtuals: true }, // Allow to convert virtual fields to JSON
    id: false, // Don't add additional id field
  }
);

// 3. Model class:
export const CartModel = mongoose.model<ICartModel>(
  "CartModel",
  CartSchema,
  "carts"
);
