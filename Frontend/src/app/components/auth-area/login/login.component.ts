import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CredentialsModel } from "src/app/models/credentials-model";
import { AuthService } from "src/app/services/auth.service";
import { UserModel } from "src/app/models/user-model";
import { NotifyService } from "src/app/services/notify.service";
import { OrdersService } from "src/app/services/orders.service";
import { ProductsService } from "src/app/services/products.service";
import { ItemModel } from "src/app/models/item-model";
import { CartsService } from "src/app/services/carts.service";
import { CartModel } from "src/app/models/cart-model";
import { ItemsService } from "src/app/services/items.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public credentials = new CredentialsModel();
  public user: UserModel = null;
  public isLoggedIn = false;
  public ordersNumber: number = 0;
  public productsNumber: number = 0;
  public items: ItemModel[];
  public cart: CartModel = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notifyService: NotifyService,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private cartsService: CartsService,
    private itemsService: ItemsService
  ) {}

  async ngOnInit(): Promise<void> {
    // getting user data:
    this.authService.isLoggedIn().subscribe((state) => {
      this.isLoggedIn = state;
      this.user = this.authService.getUserInfo();
    });

    this.cartsService.checkForOrder();

    // getting the cart:
    this.cartsService.getCartSubject().subscribe((cart: CartModel) => {
      this.cart = cart;
    });

    // getting all the orders number:
    this.ordersNumber = await this.ordersService.getOrdersNumber();

    // getting all the products number:
    this.productsNumber = await (
      await this.productsService.getAllProducts()
    ).length;

    // getting all the items:
    this.items = await this.itemsService.getItemsByCart(this.cart._id);
  }
  public async send() {
    try {
      await this.authService.login(this.credentials);
      this.notifyService.success("Welcome!");
      this.router.navigateByUrl("/products");
    } catch (err: any) {
      this.notifyService.error("Incorrect Email or Password");
    }
  }
}
