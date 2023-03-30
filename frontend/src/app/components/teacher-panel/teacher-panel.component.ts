import { Component } from "@angular/core";
import { Student } from "src/app/models/student";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-teacher-panel",
  templateUrl: "./teacher-panel.component.html",
  styleUrls: ["./teacher-panel.component.css"],
})
export class TeacherPanelComponent {
  students: Student[] = [];
  dates: string[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getStudents().subscribe((students: Student[]) => {
      this.students = students;
      const commitsData = students.map((student) => {
        const chunks = student.github.split("/");
        const length = chunks.length,
          owner = chunks[length - 2],
          repo = chunks[length - 1];
        return { owner, repo };
      });
      this.userService
        .getStudentsLastCommitDates(commitsData)
        .subscribe((dates: string[]) => {
          this.dates = dates;
        });
    });
  }
}
