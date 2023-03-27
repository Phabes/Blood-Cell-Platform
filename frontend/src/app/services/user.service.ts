import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { SERVER_NAME } from 'src/env/env'
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

  registerStudent(firstName: string, secondName: string, email: string, password: string, nick: string, github: string) {
    let newStudent = {
      firstName: firstName,
      secondName: secondName,
      email: email,
      password: password,
      nick: nick,
      github: github,
      role: "student"
    }

    return this.httpClient.post<any>(SERVER_NAME + "/user/student/register", {
      newUser: newStudent
    },
      this.httpOptions
    )


  }

  registerTeacher(firstName: string, secondName: string, email: string, password: string) {
    let newTeacher = {
      firstName: firstName,
      secondName: secondName,
      email: email,
      password: password,
      role: "teacher"
    }
    return this.httpClient.post<any>(SERVER_NAME + "/user/teacher/register", {
      newUser: newTeacher
    },
      this.httpOptions
    )
  }
}
