import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent {
  firstName = "";
  lastName = "";
  Nick = "";
  role = "";
  email = "";

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userService.getActUserInfo().subscribe((e) => {
      console.log(e);
      this.firstName = e.firstName;
      this.lastName = e.lastName;
      this.email = e.email;
      if (e.nick) this.Nick = e.nick;
    });
    this.role = this.userService.getUserRole();
  }

  passForm = this.fb.group({
    new_pass: ["", Validators.required],
    rep_new_pass: ["", Validators.required],
  });
  errors: string[] = [];

  onSubmitPass() {
    this.errors = [];
    if (
      !this.passForm.invalid &&
      this.passForm.value.new_pass &&
      this.passForm.value.new_pass == this.passForm.value.rep_new_pass
    ) {
      this.userService
        .changePassword(this.passForm.value.new_pass)
        .subscribe((data) => {
          window.alert(data.action);
          this.passForm.reset();
        });
    } else {
      window.alert("Wrong values!");
    }
  }
}
