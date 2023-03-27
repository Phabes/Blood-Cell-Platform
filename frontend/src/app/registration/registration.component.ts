import { Component } from '@angular/core'
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registerForm = this.fb.group({
    firstname: ['', Validators.required],
    secondName: ['', Validators.required],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.required],
    type: ['student'],
    nick: [''],
    github: ['']

  }, {
    validators: [this.studentRequired]
  } as AbstractControlOptions)


  constructor(private fb: FormBuilder) { }

  onSubmit() {
    if (!this.registerForm.invalid)
      console.log("sign up")
  }

  studentRequired(form: FormGroup) {
    if (form.value.type == "student") {
      if (!form.value.nick || !form.value.github)
        return { required: true }
    }
    return null
  }
}
