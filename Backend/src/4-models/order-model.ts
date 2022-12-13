import mongoose from "mongoose";

// 1. Model interface:
export interface IOrderModel extends mongoose.Document {
  // No need to specify _id Primary Key
  userId: mongoose.Schema.Types.ObjectId; // Foreign Key
  cartId: mongoose.Schema.Types.ObjectId; // Foreign Key
  totalPrice: number;
  cityToDeliver: string;
  streetToDeliver: string;
  dateToDeliver: mongoose.Schema.Types.Date;
  creationDate: mongoose.Schema.Types.Date;
  lastCreditDigits: string;
}

// 2. Model Schema:
export const OrderSchema = new mongoose.Schema<IOrderModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    totalPrice: {
      type: Number,
      required: [true, "Missing price"],
      min: [0, "Price can't be negative"],
      max: [1000, "Price can't exceed 1000"],
    },
    cityToDeliver: {
      type: String,
      required: [true, "Missing City"],
      minlength: [1, "City too short"],
      maxlength: [100, "City too long"],
      trim: true,
    },
    streetToDeliver: {
      type: String,
      required: [true, "Missing City"],
      minlength: [1, "City too short"],
      maxlength: [100, "City too long"],
      trim: true,
    },
    dateToDeliver: {
      type: mongoose.Schema.Types.Date,
      required: [true, "Missing Date"],
      min: [new Date(), "Date can't exceed today"],
    },
    creationDate: {
      type: mongoose.Schema.Types.Date,
      required: [true, "Missing Date"],
      min: [new Date(), "Date can't exceed today"],
    },
    lastCreditDigits: {
      type: String,
      required: [true, "Missing digits"],
      minlength: [4, "digits too short"],
      maxlength: [4, "digits too long"],
      trim: true,
    },
  },
  {
    versionKey: false, // Don't add __v field
    toJSON: { virtuals: true }, // Allow to convert virtual fields to JSON
    id: false, // Don't add additional id field
  }
);

// 3. Model class:
export const OrderModel = mongoose.model<IOrderModel>(
  "OrderModel",
  OrderSchema,
  "orders"
);
