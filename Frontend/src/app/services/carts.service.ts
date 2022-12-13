import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { CartModel } from "../models/cart-model";
import { OrdersService } from "./orders.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class CartsService {
  private cart: CartModel = null;
  private cartsSubject = new BehaviorSubject<CartModel>(null);
  private offCanvasCartHelper = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private ordersService: OrdersService,
    private authService: AuthService
  ) {}

  public async getCartsByUser(userId: string): Promise<CartModel[]> {
    const observable = this.http.get<CartModel[]>(
      environment.cartsByUserUrl + userId
    );
    const carts = await firstValueFrom(observable);
    return carts;
  }
  public async getLastCartByUser(userId: string): Promise<void> {
    const observable = this.http.get<CartModel>(
      environment.lastCartByUserUrl + userId
    );
    const cart = await firstValueFrom(observable);
    this.cart = cart;
    this.cartsSubject.next(cart);
  }

  public async addCart(cart: CartModel): Promise<void> {
    const observable = this.http.post<CartModel>(environment.cartsUrl, cart);
    await firstValueFrom(observable);
  }

  public async checkForOrder() {
    // if have cart, Checking if has order:
    const userId = this.authService.getUserInfo()._id;
    await this.getLastCartByUser(userId);
    if (this.cart) {
      await this.ordersService.getOrderByCartId(this.cart._id);
      this.ordersService.getHaveOrderSubject().subscribe((haveOrder) => {
        // if have order = cart has been paid, open a new cart:
        if (haveOrder) {
          this.addCart({
            userId: userId,
            creationDate: new Date().toISOString(),
          });
          this.getLastCartByUser(userId);
        }
      });
    } else {
      // If don't have active cart, open a new one:
      this.addCart({
        userId: userId,
        creationDate: new Date().toISOString(),
      });
      this.getLastCartByUser(userId);
    }
  }

  public getCartSubject() {
    return this.cartsSubject.asObservable();
  }

  public getOffCanvasCartHelper() {
    return this.offCanvasCartHelper.asObservable();
  }

  public setOffCanvasCartHelper(value: boolean) {
    return this.offCanvasCartHelper.next(value);
  }
}
