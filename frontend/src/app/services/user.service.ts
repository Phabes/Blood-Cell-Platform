import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SERVER_NAME } from "src/env/env";
import { FormGroup } from "@angular/forms";
import { Student } from "../models/student";
import { Observable } from "rxjs";
import { GithubStudent } from "../models/githubStudent";

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
  constructor(private httpClient: HttpClient) {}

  registerStudent(form: FormGroup) {
    const newUser = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      nick: form.value.nick,
      github: form.value.github,
    };

    this.httpClient
      .post<null>(
        `${SERVER_NAME}/user/student/register`,
        { newUser: newUser },
        httpOptions
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  registerTeacher(form: FormGroup) {
    const newUser = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
    };

    this.httpClient
      .post<null>(
        `${SERVER_NAME}/user/teacher/register`,
        { newUser: newUser },
        httpOptions
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  signIn(form: FormGroup) {
    const user = {
      email: form.value.email,
      password: form.value.password,
    };

    this.httpClient
      .post<null>(`${SERVER_NAME}/user/login`, user, httpOptions)
      .subscribe((data) => {
        console.log(data);
      });
  }

  getStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(
      `${SERVER_NAME}/user/students`,
      httpOptions
    );
  }

  getStudentsLastCommitDates(
    studentsCommitData: GithubStudent[]
  ): Observable<string[]> {
    return this.httpClient.post<string[]>(
      `${SERVER_NAME}/user/students/commits`,
      { studentsCommitData: studentsCommitData },
      httpOptions
    );
  }
}
