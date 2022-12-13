import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CartModel } from "src/app/models/cart-model";
import { ItemModel } from "src/app/models/item-model";
import { OrderModel } from "src/app/models/order-model";
import { UserModel } from "src/app/models/user-model";
import { AuthService } from "src/app/services/auth.service";
import { CartsService } from "src/app/services/carts.service";
import { ItemsService } from "src/app/services/items.service";
import { OrdersService } from "src/app/services/orders.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl } from "@angular/forms";
import { NotifyService } from "src/app/services/notify.service";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  public itemToSearch = "";
  public now = new Date().toISOString().split("T")[0];
  public order = new OrderModel();
  public user: UserModel = null;
  public items: ItemModel[];
  public original_items: ItemModel[];
  public totalCartPrice: number = 0;
  public cart: CartModel = null;
  public formValid = true;
  @ViewChild("content") content: ElementRef;
  @ViewChild("creditCardInput") creditCardInput: ElementRef;

  constructor(
    private router: Router,
    private cartsService: CartsService,
    private authService: AuthService,
    private itemsService: ItemsService,
    private ordersService: OrdersService,
    private modalService: NgbModal,
    private notifyService: NotifyService
  ) {}

  async ngOnInit(): Promise<void> {
    // getting user data:
    this.user = await this.authService.getUserInfo();

    // If user is admin - redirect:
    if (this.user.Role === "Admin") {
      this.router.navigateByUrl("/products");
    }
    // Getting the last cart:
    await this.cartsService.getLastCartByUser(this.user._id);
    const result = this.cartsService.getCartSubject();
    result.subscribe((cart) => {
      this.cart = cart;
    });

    // Getting all the items in current cart:
    this.items = await this.itemsService.getItemsByCart(this.cart._id);
    this.original_items = await this.itemsService.getItemsByCart(this.cart._id);

    // if there isn't any items, user shouldn't be here
    if (this.original_items.length === 0) {
      this.router.navigateByUrl("/products");
    }

    // Calculating total cart:
    this.items.map((item) => {
      this.totalCartPrice += item.totalPrice;
    });
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: "offcanvas-basic-title" })
      .result.then(
        (result) => {
          // Closed:
          this.router.navigateByUrl("/products");
        },
        (reason) => {
          // Dismissed:
          this.router.navigateByUrl("/products");
        }
      );
  }

  public async send() {
    try {
      // adding additional info to the order:
      this.order.userId = this.user._id;
      this.order.cartId = this.cart._id;
      this.order.creationDate = new Date().toISOString();
      this.order.totalPrice = this.totalCartPrice;
      console.log(this.order.dateToDeliver);
      // adding the order to DB:
      await this.ordersService.addOrder(this.order);
      // opening modal for receipt:
      this.open(this.content);
    } catch (err: any) {
      this.notifyService.error(err.message);
    }
  }

  public onSearchChange(args: Event): void {
    const inputElement: HTMLInputElement = args.target as HTMLInputElement;
    const value = inputElement.value;
    // if search bar has no value, return all the items:
    if (value.length === 0) {
      this.items = this.original_items;
      this.itemsService.setSearchedItemWord("");
      return;
    }
    // if search bar has value, return items that contain the value:
    this.items = this.items.filter((item) =>
      item.product.productName.toLowerCase().includes(value.toLowerCase())
    );
    this.itemsService.setSearchedItemWord(value);
  }

  public validateCreditCardNumber() {
    let ccNum = this.creditCardInput.nativeElement.value;
    let visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    let mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
    let amexpRegEx = /^(?:3[47][0-9]{13})$/;
    let discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    let isValid = false;
    let cardType = "";

    if (visaRegEx.test(ccNum)) {
      isValid = true;
    } else if (mastercardRegEx.test(ccNum)) {
      isValid = true;
    } else if (amexpRegEx.test(ccNum)) {
      isValid = true;
    } else if (discovRegEx.test(ccNum)) {
      isValid = true;
    }

    if (isValid) {
      this.formValid = true;
      return true;
    } else {
      alert("Please provide a valid Card number 12-16 numbers!");
      this.formValid = false;
      return false;
    }
  }

  public getUserAddress() {
    this.patchValue(this.user);
  }

  reactiveForm = new FormGroup({
    city: new FormControl(),
    street: new FormControl(),
    dateToDeliver: new FormControl(),
    lastCreditDigits: new FormControl(),
  });

  // setting address according to user data:
  public patchValue(user: UserModel) {
    let userAddress = {
      city: user.city,
      street: user.street,
    };
    // filling inputs:
    this.reactiveForm.patchValue(userAddress);
  }
}
