import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { OrderModel } from "../models/order-model";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  private haveOrderSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  public async getOrdersByUser(userId: string): Promise<OrderModel[]> {
    const observable = this.http.get<OrderModel[]>(
      environment.ordersByUserUrl + userId
    );
    const orders = await firstValueFrom(observable);
    return orders;
  }

  // checking if have order for specific cart:
  public async getOrderByCartId(cartId: string): Promise<void> {
    // console.log(cartId);
    const observable = this.http.get<OrderModel>(
      environment.orderByCartUrl + cartId
    );
    const order = await firstValueFrom(observable);
    if (order) {
      console.log("yes in in order service");
      this.haveOrderSubject.next(true);
    } else {
      this.haveOrderSubject.next(false);
    }
  }

  public async addOrder(order: OrderModel): Promise<void> {
    const observable = this.http.post<OrderModel>(environment.ordersUrl, order);
    await firstValueFrom(observable);
    this.haveOrderSubject.next(true);
  }

  public getHaveOrderSubject() {
    return this.haveOrderSubject.asObservable();
  }

  public async getOrdersNumber(): Promise<number> {
    const observable = this.http.get<OrderModel[]>(environment.ordersUrl);
    const orders = await firstValueFrom(observable);
    return orders.length;
  }
}
