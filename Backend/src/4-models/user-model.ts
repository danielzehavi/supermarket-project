import mongoose from "mongoose";
import Role from "./role-model";

// 1. Model interface describing the data:
export interface IUserModel extends mongoose.Document {
  // No need to specify _id Primary Key
  firstName: string;
  lastName: string;
  userName: string;
  identifyNumber: string;
  password: string;
  city: string;
  street: string;
  Role: Role;
}

// 2. Model schema describing more things about the model (validation, constraints...)
export const UserSchema = new mongoose.Schema<IUserModel>(
  {
    firstName: {
      type: String,
      required: [true, "Missing First Name"],
      minlength: [2, "First Name too short"],
      maxlength: [100, "First Name too long"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Missing Last Name"],
      minlength: [2, "Last Name too short"],
      maxlength: [100, "Last Name too long"],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, "Missing User Name"],
      minlength: [2, "User Name too short"],
      maxlength: [100, "User Name too long"],
      trim: true,
    },
    identifyNumber: {
      type: String,
      required: [true, "Missing Identify Number"],
      minlength: [9, "User ID too short"],
      maxlength: [9, "User ID too long"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Missing Password"],
      min: [5, "Password too short"],
      max: [30, "Password too long"],
    },
    city: {
      type: String,
      required: [true, "Missing City"],
      minlength: [2, "City too short"],
      maxlength: [100, "City too long"],
      trim: true,
    },
    street: {
      type: String,
      required: [true, "Missing Street"],
      minlength: [2, "Street too short"],
      maxlength: [100, "Street too long"],
      trim: true,
    },
    Role: {
      type: String,
      required: [true, "Missing Role"],
      trim: true,
    },
  },
  {
    versionKey: false, // Don't add __v field
    toJSON: { virtuals: true }, // Allow to convert virtual fields to JSON
    id: false, // Don't add additional id field
  }
);

// 3. Model class which mongoose create for us:
export const UserModel = mongoose.model<IUserModel>(
  "UserModel",
  UserSchema,
  "users"
);
