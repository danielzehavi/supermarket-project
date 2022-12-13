import mongoose from "mongoose";
import { CategoryModel } from "./category-model";
import { UploadedFile } from "express-fileupload";

// 1. Model interface describing the data:
export interface IProductModel extends mongoose.Document {
  // No need to specify _id Primary Key
  productName: string;
  categoryId: mongoose.Schema.Types.ObjectId; // Foreign Key
  price: number;
  imageName: string;
  image: UploadedFile;
}

// 2. Model schema describing more things about the model (validation, constraints...)
export const ProductSchema = new mongoose.Schema<IProductModel>(
  {
    productName: {
      type: String,
      required: [true, "Missing name"],
      minlength: [2, "Name too short"],
      maxlength: [100, "Name too long"],
      trim: true,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    price: {
      type: Number,
      required: [true, "Missing price"],
      min: [0, "Price can't be negative"],
      max: [1000, "Price can't exceed 1000"],
    },
    imageName: {
        type: String,
        required: [true, "Missing name"],
        minlength: [1, "Name too short"],
        maxlength: [100, "Name too long"],
        trim: true,
        unique: true,
      },
  },
  {
    versionKey: false, // Don't add __v field
    toJSON: { virtuals: true }, // Allow to convert virtual fields to JSON
    id: false, // Don't add additional id field
  }
);

// Virtual Fields
ProductSchema.virtual("category", {
  ref: CategoryModel, // Which model to specify
  localField: "categoryId", // Foreign key of the relation (in product model)
  foreignField: "_id", // Primary key of the relation (category model)
  justOne: true, // Each product has one category and not many
});

// 3. Model class which mongoose create for us:
export const ProductModel = mongoose.model<IProductModel>(
  "ProductModel",
  ProductSchema,
  "products"
);
