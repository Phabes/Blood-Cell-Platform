import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_NAME } from 'src/env/env';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { UserRole } from '../models/userRole';
import { Student } from '../models/student';
import { GithubStudent } from '../models/githubStudent';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
};
@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: Subject<UserRole> = new Subject<UserRole>();
  userID: string = '';

  constructor(private httpClient: HttpClient) {
    this.checkAuth().subscribe((data) => {
      this.setUser({
        _id: data._id,
        email: data.email,
        role: data.role,
      });
    });
  }

  setUser(user: UserRole) {
    this.userID = user._id;
    this.user.next(user);
  }

  getUser(): Observable<UserRole> {
    return this.user.asObservable();
  }

  getUserID(): string {
    return this.userID;
  }

  checkAuth() {
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

    return this.httpClient.post<any>(
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

    return this.httpClient.post<any>(
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

    return this.httpClient.post<any>(
      `${SERVER_NAME}/user/login`,
      user,
      httpOptions
    );
  }

  logout() {
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

  getStudentsLastCommitDates(
    studentsCommitData: GithubStudent[]
  ): Observable<string[]> {
    return this.httpClient.post<string[]>(
      `${SERVER_NAME}/user/students/commits`,
      { studentsCommitData: studentsCommitData },
      httpOptions
    );
  }

  changeGrade(nick: string, grade: number, act: string) {
    this.httpClient
      .post<any>(
        `${SERVER_NAME}/user/students/changes`,
        { nick: nick, grade: grade, act: act },
        httpOptions
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}
