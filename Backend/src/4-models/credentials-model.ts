import mongoose from "mongoose";

// 1. Model interface describing the data:
export interface ICredentialsModel extends mongoose.Document {
  // No need to specify _id Primary Key
  userName: string;
  password: string;
}

// 2. Model schema describing more things about the model (validation, constraints...)
export const CredentialsSchema = new mongoose.Schema<ICredentialsModel>(
  {
    userName: {
      type: String,
      required: [true, "Missing User Name"],
      minlength: [2, "User Name too short"],
      maxlength: [100, "User Name too long"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Missing Password"],
      minlength: [6, "Password too short"],
      maxlength: [30, "Password too long"],
    },
  },
  {
    versionKey: false, // Don't add __v field
    toJSON: { virtuals: true }, // Allow to convert virtual fields to JSON
    id: false, // Don't add additional id field
  }
);

// 3. Model class which mongoose create for us:
export const CredentialsModel = mongoose.model<ICredentialsModel>(
  "CredentialsModel",
  CredentialsSchema,
  "users"
);
