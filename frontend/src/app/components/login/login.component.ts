import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

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
    // email: [
    //   'qwe@qwe.qwe',
    //   Validators.compose([Validators.required, Validators.email]),
    // ],
    // password: ['Qweqweqwe1', Validators.required],
    rememberMe: [""],
  });
  errors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    this.errors = [];
    if (!this.loginForm.invalid)
      this.userService.signIn(this.loginForm).subscribe((data) => {
        if (["TEACHER_LOGGED", "STUDENT_LOGGED"].includes(data.action)) {
          const user = {
            _id: data._id,
            email: data.email,
            role: data.role,
          };
          this.userService.setUser(user);
          this.router.navigate(["/"]);
        } else if (data.action == "WRONG_PASSWORD") {
          this.errors.push("Wrong password!");
        } else if (data.action == "USER_DOESNT_EXIST") {
          this.errors.push("User doesn't exist!");
        } else {
          this.errors.push("Something went wrong!");
        }
      });
  }
}
