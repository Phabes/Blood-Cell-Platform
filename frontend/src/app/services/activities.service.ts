import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export { Activity };
interface Activity {
  date: Date;
  task: string;
  points: number;
}

@Injectable({
  providedIn: "root",
})
export class ActivitiesService {
  items: Activity[] = [];
  constructor(private http: HttpClient) {}

  addToCart(activity: Activity) {
    this.items.push(activity);
  }

  getItems() {
    return this.http.get<{ date: Date; task: string; points: number }[]>(
      "../assets/activities.json"
    );
  }

  clearCart() {
    this.items = [];
    return this.items;
  }
}
