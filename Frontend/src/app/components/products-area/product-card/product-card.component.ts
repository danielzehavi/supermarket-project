import { Component, OnInit, Input } from "@angular/core";
import { ProductModel } from "src/app/models/product-model";
import { environment } from "src/environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemsService } from "src/app/services/items.service";
import { CartModel } from "src/app/models/cart-model";
import { RoleModel } from "src/app/models/role-model";
import { ProductsService } from "src/app/services/products.service";
import { NotifyService } from "src/app/services/notify.service";

@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.css"],
})
export class ProductCardComponent implements OnInit {
  @Input("product") product: ProductModel;
  @Input("cart") cart: CartModel;
  @Input("userRole") userRole: RoleModel;
  public imageSource: string;
  public closeResult = "";
  public totalPrice: number = 0;
  public quantity: number = 0;

  constructor(
    private modalService: NgbModal,
    private itemsService: ItemsService,
    private productsService: ProductsService,
    private notifyService: NotifyService
  ) {}

  ngOnInit(): void {
    try {
      this.imageSource = environment.imagesUrl + this.product.imageName;
      this.totalPrice = this.product.price;
    } catch (err: any) {
      console.log(err.message);
    }
  }

  // method for modal
  public open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          // this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  public async addItem(product: ProductModel) {
    try {
      if (this.quantity === 0) {
        this.quantity = 1;
      }
      // check if have existing product in cart, if have - update:
      const items = await this.itemsService.getItemsByCart(this.cart._id);
      // checking if item exists in items array:
      const result = items.find((item) => item.productId === product._id);
      // if it does, update it:
      if (result) {
        this.itemsService.updateItem({
          _id: result._id,
          productId: product._id,
          quantity: this.quantity + result.quantity,
          totalPrice: this.totalPrice + result.totalPrice,
          cartId: this.cart._id,
        });
        this.notifyService.success("Cart has been updated!");
      } else {
        // if not, add it as a new item
        this.itemsService.addItem({
          productId: product._id,
          quantity: this.quantity,
          totalPrice: this.totalPrice,
          cartId: this.cart._id,
        });
        this.notifyService.success("Product bas been added!");
      }
      // reset quantity variable to 1:
      this.quantity = 1;
    } catch (err: any) {
      this.notifyService.error(err.message);
    }
  }

  onChange(args: Event): void {
    // getting input value from select event:
    const inputElement: HTMLInputElement = args.target as HTMLInputElement;
    const value = inputElement.value;
    console.log(value);

    // multiplying the price with quantity:
    this.totalPrice = +value * this.product.price;
    this.quantity = +value;
  }

  public productToEdit(product: ProductModel) {
    this.productsService.setProductToEdit(product);
  }

  public offCanvasHelper(value: boolean) {
    this.productsService.setOffCanvasHelper(value);
  }
}
