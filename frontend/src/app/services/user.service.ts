import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SERVER_NAME } from "src/env/env";
import { FormGroup } from "@angular/forms";
import { map, Observable, Subject } from "rxjs";
import { UserRole } from "../models/userRole";
import { Student } from "../models/student";
import { GithubStudent } from "../models/githubStudent";
import { Teacher } from "../models/teacher";
import { Grade } from "../models/grade";

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
  user: Subject<UserRole> = new Subject<UserRole>();
  userID = "";
  userRole = "";

  student: Observable<Student[]> | undefined;
  teacher: Observable<Teacher[]> | undefined;
  constructor(private httpClient: HttpClient) {
    this.checkAuth().subscribe((data) => {
      this.setUser({
        _id: data._id,
        email: data.email,
        role: data.role,
      });
    });
  }
  getUserData() {
    this.student = this.getStudents().pipe(
      map((e) => {
        return e.filter((student) => student._id === this.userID);
      })
    );

    this.teacher = this.getTeachers().pipe(
      map((e) => {
        return e.filter((teacher) => teacher._id === this.userID);
      })
    );
    if(this.student)
      return this.student;
    else return this.teacher;
  }

  setUser(user: UserRole) {
    this.userID = user._id;
    this.userRole = user.role;
    this.user.next(user);
  }

  getUser(): Observable<UserRole> {
    
    return this.user.asObservable();
  }

  
  getUserID(): string {
    return this.userID;
  }

  getUserRole(): string {
    return this.userRole;
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

  getTeachers(): Observable<Teacher[]> {
    return this.httpClient.get<Teacher[]>(
      `${SERVER_NAME}/user/teachers`,
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

  changeGrade(nick: string, grade: number, act: string): Observable<any> {
    return this.httpClient.post<any>(
      `${SERVER_NAME}/user/students/changes`,
      { nick: nick, grade: grade, act: act },
      httpOptions
    );
  }

  getUserSInfo(studentID: string) {
    return this.httpClient.get<Student>(
      `${SERVER_NAME}/user/student/${studentID}`,
      httpOptions
    );
  }

  getUserTInfo(teacherID: string) {
    return this.httpClient.get<Student>(
      `${SERVER_NAME}/user/teacher/${teacherID}`,
      httpOptions
    );
  }


  getActUserInfo(){
    if (this.userRole == "teacher"){
      return this.getUserTInfo(this.userID);
    }
    else{
      return this.getUserSInfo(this.userID);
    }
    
  }
  getStudentGrades(studentID: string) {
    return this.httpClient.post<Grade[]>(
      `${SERVER_NAME}/user/student/grades`,
      { studentID: studentID },
      httpOptions
    );
  }


  changePassword( password: string): Observable<any> {
    console.log(password);
    return this.httpClient.post<any>(
      `${SERVER_NAME}/user/students/change/pass`,
      { id: this.userID, newpassword: password },
      httpOptions
    );
  }
}
