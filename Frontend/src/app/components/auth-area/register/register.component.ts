import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserModel } from "src/app/models/user-model";
import { AuthService } from "src/app/services/auth.service";
import { FormControl, FormGroup } from "@angular/forms";
import { NotifyService } from "src/app/services/notify.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  public user = new UserModel();
  step: any = 1;
  submitted: any = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notifyService: NotifyService
  ) {}

  multistep = new FormGroup({
    userDetails: new FormGroup({
      identifyNumber: new FormControl(),
      userName: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl(),
    }),
    personalDetails: new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      city: new FormControl(),
      street: new FormControl(),
    }),
  });

  ngOnInit(): void {}

  submit(): void {
    this.submitted = true;

    // checking if passwords match:
    const password =
      this.multistep.controls.userDetails.controls.password.value;
    const confirmPassword =
      this.multistep.controls.userDetails.controls.confirmPassword.value;
    // if don't, return an error:
    if (password !== confirmPassword) {
      this.notifyService.error("Passwords do not match.");

      return;
    }

    this.step = this.step + 1;
    if (this.step == 3) {
      this.send();
    }
  }

  previous() {
    this.step = this.step - 1;
  }

  public async send() {
    try {
      await this.authService.register(this.user);
      this.notifyService.success("You have been successfully registered");
      this.router.navigateByUrl("/login");
    } catch (err: any) {
      this.notifyService.error(err.error);
      this.step = 1;
    }
  }
}
