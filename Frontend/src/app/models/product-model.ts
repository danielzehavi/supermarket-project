import { CategoryModel } from "./category-model";

export class ProductModel {
  public _id: string;
  public productName: string;
  public categoryId: string;
  public category: CategoryModel; // this is the virtual field!
  public price: number;
  public imageName: string;
  public image: File;
}
