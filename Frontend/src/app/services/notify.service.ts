import { Injectable } from "@angular/core";

import { Notyf } from "notyf"; // npm i notyf

@Injectable({
  providedIn: "root",
})
export class NotifyService {
  constructor() {}

  private notification = new Notyf({
    duration: 4000,
    position: { x: "center", y: "top" },
    types: [
      {
        type: "alert",
        background: "blue",
        duration: 5000,
        dismissible: true,
        position: { x: "right", y: "bottom" },
      },
    ],
  });

  public success(message: string): void {
    this.notification.success(message);
  }

  public alert(message: string): void {
    this.notification.open({
      type: "alert",
      message: message,
    });
  }

  public error(err: any): void {
    this.notification.error(this.extractError(err));
  }

  private extractError(err: any): string {
    // throw "some error..."
    if (typeof err === "string") return err;

    // reporting a single error from backend:
    if (typeof err.response?.data === "string") return err.response.data;

    // reporting an array of errors from backend:
    if (Array.isArray(err.response?.data)) return err.response.data[0];

    // throw new Error(...) - must be lats
    if (typeof err.message === "string") return err.message;

    // Non of the above
    return "Some error, please try again.";
  }
}
