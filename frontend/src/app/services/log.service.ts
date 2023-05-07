import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Log } from "../models/log";
import { SERVER_NAME } from "src/env/env";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
  withCredentials: true,
};

@Injectable({
  providedIn: "root",
})
export class LogService {
  constructor(private httpClient: HttpClient) {}

  getStudentLogs(studentID: string): Observable<Log[]> {
    return this.httpClient.get<Log[]>(
      `${SERVER_NAME}/log/${studentID}`,
      httpOptions
    );
  }
}
