import mongoose from "mongoose";

// 1. Model interface:
export interface ICategoryModel extends mongoose.Document {
  // We don't define _id
  categoryName: string;
}

// 2. Model Schema:
export const CategorySchema = new mongoose.Schema<ICategoryModel>(
  {
    categoryName: {
      type: String,
      required: [true, "Missing name"],
      minlength: [2, "Name too short"],
      maxlength: [100, "Name too long"],
      trim: true,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

// 3. Model class:
export const CategoryModel = mongoose.model<ICategoryModel>(
  "CategoryModel",
  CategorySchema,
  "categories"
);
