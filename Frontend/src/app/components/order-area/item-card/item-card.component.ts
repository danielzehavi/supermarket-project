import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { ItemModel } from "src/app/models/item-model";
import { ItemsService } from "src/app/services/items.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-item-card",
  templateUrl: "./item-card.component.html",
  styleUrls: ["./item-card.component.css"],
})
export class ItemCardComponent implements OnInit {
  public imageSource: string;
  public foundMatch = false;

  @Input("item") item: ItemModel;
  @ViewChild("itemName") itemName: ElementRef;

  constructor(private itemsService: ItemsService) {}

  ngOnInit(): void {
    this.imageSource = environment.imagesUrl;
    this.itemsService.getSearchedItemWord().subscribe((word) => {
      // if user searched for product:
      if (word) {
        let productNameCheck = this.item.product.productName.toLowerCase();
        let productName = this.item.product.productName;
        let html = "";
        // if the searched word matches the product name, add a background color to the letter:
        const startPosition = productNameCheck.indexOf(word.toLowerCase());
        if (startPosition > -1) {
          this.foundMatch = true;
          html += `<span>${productName.substring(
            0,
            startPosition
          )}<span style="background-color:yellow;">${word}</span>${productName.substring(
            startPosition + word.length
          )}</span>`;
        }
        // show the product name with the added background color:
        this.itemName.nativeElement.innerHTML = html;
      } else {
        // else show original product name:
        this.foundMatch = false;
        this.itemName.nativeElement.innerHTML = this.item.product.productName;
      }
    });
  }
}
