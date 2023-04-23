import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SERVER_NAME } from "src/env/env";
import { FormGroup } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { User } from "../models/user";
import { Student } from "../models/student";
import { Router } from "@angular/router";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
  withCredentials: true,
};
@Injectable({
  providedIn: "root",
})
export class UserService {

  user = new Subject<User>();
  constructor(private httpClient: HttpClient, private router:Router) {
    this.checkAuth().subscribe((data)=>{
      this.setUser({email:data.email,role:data.role});

    });
  }

  setUser(user:User){
    this.user.next(user);
  }

  getUser(){
    return this.user.asObservable();
  }

  checkAuth(){
    return this.httpClient.post<any>(
      `${SERVER_NAME}/user/authUser`,
      {},
      httpOptions
    );
  }

  registerStudent(form: FormGroup) {
    const newUser = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      nick: form.value.nick,
      github: form.value.github,
    };

    return this.httpClient
      .post<any>(
        `${SERVER_NAME}/user/student/register`,
        { newUser: newUser },
        httpOptions
      );
  }

  registerTeacher(form: FormGroup) {
    const newUser = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
    };

    return this.httpClient
      .post<any>(
        `${SERVER_NAME}/user/teacher/register`,
        { newUser: newUser },
        httpOptions
      );
  }

  signIn(form: FormGroup) {
    const user = {
      email: form.value.email,
      password: form.value.password,
    };

    return this.httpClient
      .post<any>(`${SERVER_NAME}/user/login`, user, httpOptions);
  }

  logout(){
    return this.httpClient.post<any>(
      `${SERVER_NAME}/user/logout`,
      {},
      httpOptions
    );
  }

  getStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(
      `${SERVER_NAME}/user/students`,
      httpOptions
    );
  }

  getStudentsLastCommitDates(studentsCommitData: any[]): Observable<string[]> {
    return this.httpClient.post<string[]>(
      `${SERVER_NAME}/user/students/commits`,
      { studentsCommitData: studentsCommitData },
      httpOptions
    );
  }
}
