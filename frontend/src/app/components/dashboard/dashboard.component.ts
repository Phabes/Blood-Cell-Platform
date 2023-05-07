import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Log } from "src/app/models/log";
import { ActivitiesService } from "src/app/services/activities.service";
import { LogService } from "src/app/services/log.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
  // tasks!: Observable<{ date: Date; task: string; points: number }[]>;
  logs: Log[] = [];

  constructor(
    private userService: UserService,
    private logService: LogService
  ) {}

  ngOnInit(): void {
    // this.tasks = this.activitiesService.getItems();
    this.logService
      .getStudentLogs(this.userService.getUserID())
      .subscribe((data) => {
        this.logs = data;
      });
  }
}
