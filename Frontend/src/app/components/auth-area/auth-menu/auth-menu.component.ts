import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserModel } from "src/app/models/user-model";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-auth-menu",
  templateUrl: "./auth-menu.component.html",
})
export class AuthMenuComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  public user: UserModel = null;
  public isLoggedIn = false;

  async ngOnInit(): Promise<void> {
    this.authService.isLoggedIn().subscribe((state) => {
      this.isLoggedIn = state;
      this.user = this.authService.getUserInfo();
    });
  }

  public async sendLogout() {
    try {
      this.router.navigateByUrl("/logout");
    } catch (err: any) {
      alert(err.message);
    }
  }
}
