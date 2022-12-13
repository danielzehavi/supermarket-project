import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
})
export class FooterComponent implements OnInit {
  constructor() {}

  public now = new Date();

  ngOnInit(): void {}
}
