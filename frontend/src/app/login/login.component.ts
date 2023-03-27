import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.required],
    rememberMe: ['']
  })


  constructor(private fb: FormBuilder) { }

  onSubmit() {
    if (!this.loginForm.invalid)
      console.log("log in")
  }
}
