import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import jwt from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class InterceptorService implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token");
    if (token) {
      // decoding the token:
      let decodedToken = jwt(token) as any;
      let currentDate = new Date();

      // checking if token expired:
      // JWT exp is in seconds, checking if 2 hours have passed
      if (decodedToken.exp < currentDate.getTime() / 1000) {
        // remove from localStorage if expired:
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      const cloned = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token),
      });
      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
}
