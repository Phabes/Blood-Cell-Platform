import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_NAME } from 'src/env/env';
import { Message } from '../models/message';
import { Student } from '../models/student';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private httpClient: HttpClient) {}

  sendMessageToAll(message: Message) {
    this.httpClient
      .post<any>(
        `${SERVER_NAME}/message/all`,
        { message: message },
        httpOptions
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  sendMessageToOne(message: Message, receiver: Student) {
    this.httpClient
      .post<any>(
        `${SERVER_NAME}/message/one`,
        { message: message, receiver: receiver._id },
        httpOptions
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}
