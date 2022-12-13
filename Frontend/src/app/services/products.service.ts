import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { CategoryModel } from "../models/category-model";
import { ProductModel } from "../models/product-model";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private productToEdit = new BehaviorSubject<ProductModel>(null);
  private products = new BehaviorSubject<ProductModel[]>(null);
  private offCanvasHelper = new BehaviorSubject<boolean>(false);
  private adminFormHelper = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {
    this.getAllProducts();
  }

  public async getAllCategories(): Promise<CategoryModel[]> {
    const observable = this.http.get<CategoryModel[]>(
      environment.categoriesUrl
    );
    const categories = await firstValueFrom(observable);
    return categories;
  }

  public async getAllProducts(): Promise<ProductModel[]> {
    const observable = this.http.get<ProductModel[]>(environment.productsUrl);
    const products = await firstValueFrom(observable);
    this.products.next(products);
    return products;
  }

  public async getProductsByCategory(
    categoryId: string
  ): Promise<ProductModel[]> {
    const observable = this.http.get<ProductModel[]>(
      environment.productsByCategoryUrl + categoryId
    );
    const products = await firstValueFrom(observable);
    return products;
  }

  public async addProduct(product: ProductModel): Promise<void> {
    // For sending data + files we need to send FormData object
    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("categoryId", product.categoryId.toString());
    formData.append("price", product.price.toString());
    formData.append("imageName", product.imageName);
    formData.append("image", product.image);
    // Add to backend:
    const addedProduct = await firstValueFrom(
      this.http.post<ProductModel>(environment.productsUrl, formData)
    );
    this.getAllProducts();
  }
  public async updateProduct(product: ProductModel): Promise<void> {
    // For sending data + files we need to send FormData object
    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("categoryId", product.categoryId.toString());
    formData.append("price", product.price.toString());
    formData.append("imageName", product.imageName);
    formData.append("image", product.image);

    // Add to backend:
    const addedProduct = await firstValueFrom(
      this.http.put<ProductModel>(
        environment.productsUrl + product._id,
        formData
      )
    );
    this.getAllProducts();
  }
  public getProductList() {
    return this.products.asObservable();
  }

  public getProductToEdit() {
    return this.productToEdit.asObservable();
  }

  public setProductToEdit(product: ProductModel) {
    return this.productToEdit.next(product);
  }

  public getOffCanvasHelper() {
    return this.offCanvasHelper.asObservable();
  }

  public setOffCanvasHelper(value: boolean) {
    return this.offCanvasHelper.next(value);
  }

  public getAdminFormHelper() {
    return this.adminFormHelper.asObservable();
  }

  public setAdminFormHelper(value: boolean) {
    return this.adminFormHelper.next(value);
  }
}
