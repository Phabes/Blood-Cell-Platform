import { UserCartComponent } from "../user-cart/user-cart.component";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

export {User};
  interface User {
    nick: string,
    points : number
 }

 @Injectable({
    providedIn: 'root'
  })

  export class LeaderBoardService {
    items: User[] = [];
    constructor(
        private http: HttpClient
      ) {}

  addToCart(user:  User) {
    this.items.push(user);
  }

  getItems() {
    return this.http.get<{nick: string, points: number}[]>('../assets/users.json');
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

  
  }