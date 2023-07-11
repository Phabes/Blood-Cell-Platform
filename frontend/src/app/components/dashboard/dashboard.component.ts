import { Component } from "@angular/core";
import { Activity } from "src/app/models/activity";
import { Log } from "src/app/models/log";
import { Options } from "src/app/models/options";
import { ActivitiesService } from "src/app/services/activities.service";
import { LogService } from "src/app/services/log.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
  activities: Activity[] = [];
  grades: string[] = [];
  logs: Log[] = [];
  sumOfPoints = 0;
  generalMaxPoints = 0;
  waterHeight = 0;
  waterTop = 0;

  options: Options = {
    orderBy: "Name",
    orderDir: "ASC",
    page: 1,
    size: 8,
  };
  logsSize = 0;
  constructor(
    private userService: UserService,
    private logService: LogService,
    private actService: ActivitiesService
  ) {}

  get numbers(): number[] {
    const limit = Math.ceil(this.logsSize / this.options.size);
    return Array.from({ length: limit }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    this.reload();
    this.getPoints();

    this.actService.getActivities().subscribe((data) => {
      this.activities = data;
      const studentID = this.userService.getUserID();
      this.activities.forEach((activity) => {
        const index = activity.grades.findIndex(
          (grade) => grade.student_id == studentID
        );
        if (index != -1) {
          const grade = activity.grades[index].grade!.toString();
          if (grade != "") this.grades.push(grade);
          else this.grades.push("No Grade");
        } else this.grades.push("No Grade");
      });
    });
  }

  getPoints() {
    const act = this.actService.getActivities().toPromise();
    act.then((e) => {
      if (e != undefined) {
        for (let i = 0; i < e.length; i++) {
          this.generalMaxPoints += e[i].max_points;
        }
        this.userService
          .getUserSInfo(this.userService.getUserID())
          .subscribe((data) => {
            if (data.grades) {
              for (let i = 0; i < data.grades.length; i++) {
                this.sumOfPoints += Number(data.grades[i].grade) || 0;
              }
            }
            const percentage = this.sumOfPoints / this.generalMaxPoints;
            this.waterHeight = 290 * percentage + 80;
            this.waterTop = 290 * (1 - percentage) + 5;
          });
      }
    });
  }

  to(page: number) {
    this.options.page = page;
    this.reload();
  }

  next() {
    this.options.page++;
    this.reload();
  }

  prev() {
    this.options.page--;
    this.reload();
  }

  size(size: number) {
    this.options.size = size;
    this.options.page = 1;
    this.reload();
  }

  reload() {
    this.logService
      .getStudentLogs(this.userService.getUserID())
      .subscribe((data) => {
        this.logsSize = data.length;
        this.logs = data.slice(
          (this.options.page - 1) * this.options.size,
          Math.min(
            data.length,
            (this.options.page - 1) * this.options.size + this.options.size
          )
        );
      });
  }
}
