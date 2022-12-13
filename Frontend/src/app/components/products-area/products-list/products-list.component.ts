import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { CategoryModel } from "src/app/models/category-model";
import { ProductModel } from "src/app/models/product-model";
import { ProductsService } from "src/app/services/products.service";
import { AuthService } from "src/app/services/auth.service";
import { CartsService } from "src/app/services/carts.service";
import { CartModel } from "src/app/models/cart-model";
import { UserModel } from "src/app/models/user-model";
import { OrdersService } from "src/app/services/orders.service";
import { NotifyService } from "src/app/services/notify.service";
import { ItemsService } from "src/app/services/items.service";
import { ItemModel } from "src/app/models/item-model";

@Component({
  selector: "app-products-list",
  templateUrl: "./products-list.component.html",
  styleUrls: ["./products-list.component.css"],
})
export class ProductsListComponent implements OnInit {
  public categories: CategoryModel[];
  public products: ProductModel[];
  public original_products: ProductModel[];
  public cart: CartModel;
  public user: UserModel = null;
  public productToSearch = "";
  public closeResult = "";
  public closeCanvasHelper = false;
  public categoryName = "All Categories";
  public items: ItemModel[];
  public totalCartPrice: number = 0;
  @ViewChild("content") content: ElementRef;
  @ViewChild("searchInput") searchInput: ElementRef<HTMLInputElement>;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private productsService: ProductsService,
    private cartsService: CartsService,
    public authService: AuthService,
    private ordersService: OrdersService,
    private notifyService: NotifyService,
    private itemsService: ItemsService
  ) {}

  public isAdmin() {
    return this.authService.isAdmin();
  }

  open(content: any) {
    this.offcanvasService
      .open(content, { ariaLabelledBy: "offcanvas-basic-title" })
      .result.then(
        (result) => {
          // this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

          // if user is admin, set the form helper to true to reset the form
          if (this.user.Role === "Admin") {
            this.productsService.setAdminFormHelper(true);
          }
          this.productsService.setProductToEdit(null);
        }
      );
  }

  async ngOnInit() {
    try {
      // getting all the products:
      this.productsService.getProductList().subscribe((products) => {
        this.products = products;
        this.original_products = products;
      });
      // getting all the categories:
      this.categories = await this.productsService.getAllCategories();
      // getting user data:
      this.user = this.authService.getUserInfo();

      // offcanvas helper for products:
      this.productsService.getOffCanvasHelper().subscribe((offCanvasHelper) => {
        if (offCanvasHelper) {
          this.open(this.content);
        }
      });

      // offcanvas helper for cart:
      this.cartsService
        .getOffCanvasCartHelper()
        .subscribe((offCanvasCartHelper) => {
          if (offCanvasCartHelper) {
            this.offcanvasService.dismiss(this.content);
          }
        });

      if (this.user.Role === "User") {
        const result = await this.cartsService.checkForOrder();
        // getting the cart:
        this.cartsService.getCartSubject().subscribe((cart: CartModel) => {
          this.cart = cart;
        });
        const orders = await this.ordersService.getOrdersByUser(this.user._id);

        // Getting all the items in current cart:
        this.items = await this.itemsService.getItemsByCart(this.cart._id);
        // Calculating total cart:
        this.items.map((item) => {
          this.totalCartPrice += item.totalPrice;
        });

        const allCartsByUser = await this.cartsService.getCartsByUser(
          this.user._id
        );

        if (allCartsByUser.length < 2 && orders.length === 0) {
          // if it's user's first time buying:
          this.notifyService.alert(
            `Welcome ${this.user.firstName} to your first purchase! :)`
          );
        } else if (this.items.length <= 0 && orders.length >= 1) {
          // if user doesn't have an open cart:
          this.notifyService.alert(
            `Your last order was from: ${
              new Date(orders[orders.length - 1].creationDate)
                .toISOString()
                .split("T")[0]
            }, Total cart was ${orders[orders.length - 1].totalPrice}$`
          );
        } else {
          // if user has an open cart:
          this.notifyService.alert(
            `You have an open cart from ${
              new Date(this.cart.creationDate).toISOString().split("T")[0]
            }, Total cart is - ${this.totalCartPrice}$`
          );
        }
      }
    } catch (err: any) {
      this.notifyService.error(err.message);
      console.log(err.message);
    }
  }

  async onSelectChange(args: Event): Promise<void> {
    try {
      // getting categoryId from select event:
      const selectElement: HTMLSelectElement = args.target as HTMLSelectElement;
      const value = selectElement.value;
      if (value === "All Categories") {
        this.products = await this.productsService.getAllProducts();
        this.categoryName = value;
      } else {
        // calling all the products with the categoryId:
        this.products = await this.productsService.getProductsByCategory(value);
        this.categoryName = value;
      }
    } catch (err: any) {
      alert(err.message);
    }
  }

  public async onSearchChange(args: Event): Promise<void> {
    const inputElement: HTMLInputElement = args.target as HTMLInputElement;
    const value = inputElement.value;
    // if search bar has no value, and user searched in specific category:
    if (value.length === 0 && this.categoryName !== "All Categories") {
      this.products = await this.productsService.getProductsByCategory(
        this.categoryName
      );
      return;
    } else if (value.length === 0) {
      // if search bar has no value, return all the products:
      this.products = this.original_products;
    }
    // if search bar has value, return products that contain the value:
    this.products = this.products.filter((product) =>
      product.productName.toLowerCase().includes(value.toLowerCase())
    );
  }
}
