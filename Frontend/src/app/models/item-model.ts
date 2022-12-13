import { ProductModel } from "./product-model";

export class ItemModel {
  public _id?: string;
  public productId: string;
  public quantity: number;
  public totalPrice: number;
  public cartId: string;
  public product?: ProductModel; // this is the virtual field!
}
