import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CategoryModel } from "src/app/models/category-model";
import { ProductModel } from "src/app/models/product-model";
import { ProductsService } from "src/app/services/products.service";
import { FormGroup, FormControl, NgForm } from "@angular/forms";
import { NotifyService } from "src/app/services/notify.service";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.css"],
})
export class AddProductComponent implements OnInit {
  public categories: CategoryModel[];
  public product = new ProductModel();
  public productToEdit: ProductModel | null;
  public myFormGroup: FormData;
  @ViewChild("imageFileInput") imageFileInput: ElementRef<HTMLInputElement>;
  @ViewChild("addProductForm")
  addProductForm: ElementRef<NgForm>;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private notifyService: NotifyService
  ) {}

  async ngOnInit() {
    try {
      this.categories = await this.productsService.getAllCategories();
      // subscribing for productToEdit changes:
      this.productsService.getProductToEdit().subscribe((productToEdit) => {
        this.productToEdit = productToEdit;
        this.setValue(productToEdit);
      });
      // subscribing for adminFormHelper changes:
      this.productsService.getAdminFormHelper().subscribe((resetForm) => {
        // If it's true, reset:
        if (resetForm) {
          this.reactiveForm.setValue({
            productCategory: "",
            productName: "",
            productPrice: "",
          });
          this.imageFileInput.nativeElement.value = "";
          this.productsService.setAdminFormHelper(false);
          this.productsService.setProductToEdit(null);
        }
      });
    } catch (err: any) {
      alert(err.message);
    }
  }

  public async send(args: Event) {
    try {
      this.product.image = this.imageFileInput.nativeElement.files[0];

      if (this.productToEdit) {
        this.product._id = this.productToEdit._id;
        await this.productsService.updateProduct(this.product);
        this.notifyService.success("Product has been updated");
      } else {
        await this.productsService.addProduct(this.product);
        this.notifyService.success("Product has been added");
      }

      this.imageFileInput.nativeElement.value = "";
    } catch (err: any) {
      this.notifyService.error(err.message);
    }
  }

  reactiveForm = new FormGroup({
    productCategory: new FormControl(),
    productName: new FormControl(),
    productPrice: new FormControl(),
  });

  setValue(productToEdit: ProductModel) {
    let newProductToEdit = {
      productCategory: productToEdit.categoryId,
      productName: productToEdit.productName,
      productPrice: productToEdit.price,
    };

    this.reactiveForm.setValue(newProductToEdit);
  }
}
