import { ItemModel } from "src/app/models/item-model";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ItemsService {
  private searchedItemWord = new BehaviorSubject<string>(null);
  constructor(private http: HttpClient) {}

  public async getItemsByCart(cartId: string): Promise<ItemModel[]> {
    const observable = this.http.get<ItemModel[]>(
      environment.itemsByCart + cartId
    );
    const items = await firstValueFrom(observable);

    return items;
  }

  public async addItem(item: ItemModel): Promise<void> {
    const observable = this.http.post<ItemModel>(environment.itemsUrl, item);
    await firstValueFrom(observable);
  }

  public async updateItem(item: ItemModel): Promise<void> {
    const observable = this.http.patch<ItemModel>(
      environment.itemsUrl + item._id,
      item
    );
    await firstValueFrom(observable);
  }

  public async deleteItem(_id: string): Promise<void> {
    const observable = this.http.delete(environment.itemsUrl + _id);
    await firstValueFrom(observable);
  }

  public async deleteAllItemsByCart(cartId: string): Promise<void> {
    const observable = this.http.delete(
      environment.deleteAllItemsByCart + cartId
    );
    await firstValueFrom(observable);
  }

  public getSearchedItemWord() {
    return this.searchedItemWord.asObservable();
  }

  public setSearchedItemWord(value: string) {
    return this.searchedItemWord.next(value);
  }
}
