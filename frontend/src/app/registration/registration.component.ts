import { Component } from "@angular/core";
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"]
})
export class RegistrationComponent {
  registerForm = this.fb.group({
    email: ["test@test.test", Validators.compose([Validators.required, Validators.email])],
    firstName: ["Jan", Validators.required],
    lastName: ["Tomek", Validators.required],
    password: ["123123123", Validators.compose([Validators.required, Validators.minLength(8)])],
    type: ["student"],
    nick: ["Huan"],
    github: ["gitRepo"]

  }, {
    validators: [this.studentRequired]
  } as AbstractControlOptions);


  constructor(private fb: FormBuilder, private userService: UserService) { }

  onSubmit() {
    if (!this.registerForm.invalid)
      if (this.registerForm.value.type === "student")
        this.userService.registerStudent(this.registerForm);
      else if (this.registerForm.value.type === "teacher")
        this.userService.registerTeacher(this.registerForm);
  }

  studentRequired(form: FormGroup) {
    if (form.value.type == "student") {
      if (!form.value.nick || !form.value.github)
        return { required: true };
    }
    return null;
  }
}
