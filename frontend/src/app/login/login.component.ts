import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: [
      "a@a.pl",
      Validators.compose([Validators.required, Validators.email]),
    ],
    password: ["123123123", Validators.required],
    rememberMe: [""],
  });

  constructor(private fb: FormBuilder, private userService: UserService) {}

  onSubmit() {
    if (!this.loginForm.invalid) this.userService.signIn(this.loginForm);
  }
}
