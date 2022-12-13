import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom, Observable } from "rxjs";
import { UserModel } from "../models/user-model";
import { CredentialsModel } from "../models/credentials-model";
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isAuthenticateSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  isLoggedIn(): Observable<boolean> {
    if (localStorage.getItem("token")) {
      this.isAuthenticateSubject.next(true);
    } else {
      this.isAuthenticateSubject.next(false);
    }
    return this.isAuthenticateSubject.asObservable();
  }

  public async register(user: UserModel): Promise<void> {
    let newUser = new UserModel();
    const response = this.http.post<string>(environment.registerUrl, user);
    const token = await firstValueFrom(response);
    newUser = jwtDecode(token) as any;
    this.isAuthenticateSubject.next(true);
    localStorage.setItem("token", token); // Save token in storage.
  }

  public async login(credentials: CredentialsModel): Promise<void> {
    const response = this.http.post<string>(environment.loginUrl, credentials);
    const token = await firstValueFrom(response);
    const newUser = jwtDecode(token) as any;
    this.isAuthenticateSubject.next(true);
    localStorage.setItem("token", token); // Save token in storage.
  }

  public logout(): void {
    this.isAuthenticateSubject.next(false);
    localStorage.removeItem("token");
  }
  public isAdmin(): boolean {
    const token = localStorage.getItem("token");
    const user = jwtDecode(token) as any;
    return user.user.Role === "Admin";
  }

  public getUserInfo(): UserModel {
    const token = localStorage.getItem("token");
    const user = jwtDecode(token) as any;
    return user.user;
  }
}
