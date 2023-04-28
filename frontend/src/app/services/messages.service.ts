import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SERVER_NAME } from "src/env/env";
import { Message } from "../models/message";
import { Student } from "../models/student";
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
  withCredentials: true,
};

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  constructor(private httpClient: HttpClient) {}

  sendMessageToAll(message: Message): Observable<any> {
    return this.httpClient.post<null>(
      `${SERVER_NAME}/message/all`,
      { message: message },
      httpOptions
    );
  }

  sendMessageToOne(message: Message, receiver: Student): Observable<any> {
    return this.httpClient.post<null>(
      `${SERVER_NAME}/message/one`,
      { message: message, receiver: receiver._id },
      httpOptions
    );
  }

  getStudentMessages(studentID: string): Observable<Message[]> {
    return this.httpClient.get<Message[]>(
      `${SERVER_NAME}/message/${studentID}`,
      httpOptions
    );
  }
}
