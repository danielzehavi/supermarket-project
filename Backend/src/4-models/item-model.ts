import mongoose from "mongoose";
import { ProductModel } from "./product-model";

// 1. Model interface:
export interface IItemModel extends mongoose.Document {
  // No need to specify _id Primary Key
  productId: mongoose.Schema.Types.ObjectId; // Foreign Key
  quantity: number;
  totalPrice: number;
  cartId: mongoose.Schema.Types.ObjectId; // Foreign Key
}

// 2. Model Schema:
export const ItemSchema = new mongoose.Schema<IItemModel>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    quantity: {
      type: Number,
      required: [true, "Missing Quantity"],
      min: [1, "Quantity has to be equal or more than 1"],
      max: [100, "Quantity can't exceed 100"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Missing price"],
      min: [0, "Price can't be negative"],
      max: [2000, "Price can't exceed 2000"],
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    versionKey: false, // Don't add __v field
    toJSON: { virtuals: true }, // Allow to convert virtual fields to JSON
    id: false, // Don't add additional id field
  }
);

// // Virtual Fields
ItemSchema.virtual("product", {
  ref: ProductModel, // Which model to specify
  localField: "productId", // Foreign key of the relation (in product model)
  foreignField: "_id", // Primary key of the relation (category model)
  justOne: true, // Each product has one category and not many
});

// 3. Model class:
export const ItemModel = mongoose.model<IItemModel>(
  "ItemModel",
  ItemSchema,
  "items"
);
