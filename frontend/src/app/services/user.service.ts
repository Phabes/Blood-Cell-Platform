import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { SERVER_NAME } from 'src/env/env'
import { FormGroup } from '@angular/forms'
@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  }
  constructor(private httpClient: HttpClient) { }

  registerStudent(form: FormGroup) {
    let newUser = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      nick: form.value.nick,
      github: form.value.github
    }
    fetch(SERVER_NAME + "/user/student/register", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ newUser: newUser })
    })
      .then((res) => console.log(res))
      .catch(err => console.log(err))

  }

  registerTeacher(form: FormGroup) {
    let newUser = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password
    }
    fetch(SERVER_NAME + "/user/teacher/register", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ newUser: newUser })
    })
      .then((res) => console.log(res))
      .catch(err => console.log(err))
  }

  signIn(form: FormGroup) {
    let user = {
      email: form.value.email,
      password: form.value.password
    }

    fetch(SERVER_NAME + "/user/login", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(user)
    })
      .then((res) => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err))
  }
}
