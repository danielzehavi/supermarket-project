import { Component, OnInit, Input, SimpleChange } from "@angular/core";
import { CartModel } from "src/app/models/cart-model";
import { ItemModel } from "src/app/models/item-model";
import { UserModel } from "src/app/models/user-model";
import { AuthService } from "src/app/services/auth.service";
import { CartsService } from "src/app/services/carts.service";
import { ItemsService } from "src/app/services/items.service";
import { NotifyService } from "src/app/services/notify.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  @Input("cart") cart: CartModel;
  public user: UserModel = null;
  public items: ItemModel[];
  public imageSource: string;
  public totalCartPrice: number = 0;

  constructor(
    private cartsService: CartsService,
    private authService: AuthService,
    private itemsService: ItemsService,
    private notifyService: NotifyService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.cartsService.getCartSubject().subscribe((cart: CartModel) => {
        this.cart = cart;
      });
      // Getting all the items in current cart:
      this.items = await this.itemsService.getItemsByCart(this.cart._id);
      // Calculating total cart:
      this.items.map((item) => {
        this.totalCartPrice += item.totalPrice;
      });
      this.imageSource = environment.imagesUrl;
    } catch (err: any) {
      alert(err.message);
    }
  }

  public async removeItem(_id: string) {
    try {
      await this.itemsService.deleteItem(_id);
      const indexToDelete = this.items.findIndex((i) => i._id === _id);
      this.items.splice(indexToDelete, 1);
      // Recalculating total cart:
      this.totalCartPrice = 0;
      this.items.map((item) => {
        this.totalCartPrice += item.totalPrice;
      });
      this.notifyService.success("Item Removed!");
    } catch (err: any) {
      this.notifyService.error(err.message);
    }
  }

  public async removeAllItems(cartId: string) {
    try {
      const ok = window.confirm("Are you sure?");
      if (!ok) return;
      await this.itemsService.deleteAllItemsByCart(cartId);
      this.items.length = 0;
      // Recalculating total cart:
      this.totalCartPrice = 0;
      this.notifyService.success("All Items Removed!");
    } catch (err: any) {
      this.notifyService.error(err.message);
    }
  }

  public closeOffCanvas() {
    this.cartsService.setOffCanvasCartHelper(true);
  }
}
