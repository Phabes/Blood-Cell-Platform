import { Component } from "@angular/core";
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
})
export class RegistrationComponent {
  registerForm = this.fb.group(
    {
      email: [
        "test6@test.test",
        Validators.compose([Validators.required, Validators.email]),
      ],
      firstName: ["Jan", Validators.required],
      lastName: ["Tomek", Validators.required],
      password: [
        "zaq1@WSX",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      type: ["student"],
      nick: ["Huan"],
      github: [
        "https://bitbucket.org/agh-io-project/workspace/projects/IOIOIOIO",
      ],
    },
    {
      validators: [this.studentRequired],
    } as AbstractControlOptions
  );
  errors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    this.errors = [];
    if (!this.registerForm.invalid)
      if (this.registerForm.value.type === "student")
        this.userService
          .registerStudent(this.registerForm)
          .subscribe((data) => {
            console.log(data);
            if (data.action == "STUDENT_REGISTERED") {
              const user = {
                _id: data._id,
                email: data.email,
                role: data.role,
              };
              this.userService.setUser(user);
              this.router.navigate(["/"]);
            } else if (data.action == "USER_EXISTS") {
              this.errors.push("User exists!");
            } else if (data.action == "USER_VALIDATION_ERROR") {
              this.errors.push(data.errorMessages);
            } else {
              this.errors.push("Something went wrong!");
            }
          });
      else if (this.registerForm.value.type === "teacher")
        this.userService
          .registerTeacher(this.registerForm)
          .subscribe((data) => {
            console.log(data);

            if (data.action == "TEACHER_REGISTERED") {
              const user = {
                _id: data._id,
                email: data.email,
                role: data.role,
              };
              this.userService.setUser(user);
              this.router.navigate(["/"]);
            } else if (data.action == "USER_EXISTS") {
              this.errors.push("User exists!");
            } else if (data.action == "USER_VALIDATION_ERROR") {
              this.errors.push("User validation error!");
            } else {
              this.errors.push("Something went wrong!");
            }
          });
  }

  studentRequired(form: FormGroup) {
    if (form.value.type == "student") {
      if (!form.value.nick || !form.value.github) return { required: true };
    }
    return null;
  }
}
