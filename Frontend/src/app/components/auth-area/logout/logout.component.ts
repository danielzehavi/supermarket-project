import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { NotifyService } from "src/app/services/notify.service";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
})
export class LogoutComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notifyService: NotifyService
  ) {}

  ngOnInit(): void {
    try {
      this.authService.logout();
      this.notifyService.success("You have been successfully logged out");
      this.router.navigateByUrl("/login");
    } catch (err: any) {
      this.notifyService.error(err);
      console.log(err);
    }
  }
}
