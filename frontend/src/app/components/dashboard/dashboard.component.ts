import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { ActivitiesService } from "src/app/services/activities.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
  tasks!: Observable<{ date: Date; task: string; points: number }[]>;

  constructor(private activitiesService: ActivitiesService) {}

  ngOnInit(): void {
    this.tasks = this.activitiesService.getItems();
    this.activitiesService.getHeadersInfo();
  }
}
