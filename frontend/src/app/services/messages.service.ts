import { UserCartComponent } from "../user-cart/user-cart.component";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

export {Message};
  interface Message {
    date: Date,
    task : string,
    points: number
 }

 @Injectable({
    providedIn: 'root'
  })

  export class MessagesService {
    items: Message[] = [];
    constructor(
        private http: HttpClient
      ) {}

  addToCart(message:  Message) {
    this.items.push(message);
  }

  getItems() {
    return this.http.get<{ date: Date,
        task : string,
        points: number}[]>('../assets/messages.json');
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

  
  }