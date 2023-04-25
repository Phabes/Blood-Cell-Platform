import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { LeaderBoardService } from "src/app/services/leaderboard.service";
import { CsvService } from "src/app/services/csv.service";
import { Student } from "src/app/models/student";
import { UserService } from "src/app/services/user.service";
// import { StudentFilterPipe } from "src/app/student-filter.pipe";
import { FormBuilder } from "@angular/forms";
import { ActivitiesService } from "src/app/services/activities.service";
import { Cell } from "src/app/models/cell";

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent {
  users$!: Observable<Student[]>;
  filteredUsers$: Observable<Student[]> | undefined;
  pointsMax: number | null | undefined;
  pointsMin: number | null | undefined;
  data!: Student[];

  value!: Cell[][];
  grades!: { nick: string; grades: (number | null)[] }[];
  SearchNick: any;

  constructor(
    private fb: FormBuilder,
    private cartService: LeaderBoardService,
    private _csvService: CsvService,
    private userService: UserService,
    private actService: ActivitiesService
  ) {}

  async change(
    event: any,
    student_name: string,
    new_grade: number | null,
    j: number
  ) {
    //  const j = 0;
    //  const student_name = "Huan";
    //  const new_grade = 5;
    console.log(event.target.value, student_name, j);
    if (event.target.value) {
      const idx = this.value.length;
      const act = this.value[idx - 1][j].id;
      const max_points = this.value[idx - 1][j].max_points;
      if (event.target.value >= 0 && event.target.value <= max_points) {
        this.userService.changeGrade(student_name, event.target.value, act);
      } else {
        window.alert("Podano niewłaściwą ilość punktów");
      }
    }

    this.userService.getStudents().subscribe((users) => {
      console.log(users[0]);
      this.data = users;
    });

    this.actService.getHeadersInfo().subscribe((e) => {
      this.value = e.header_cells;
      this.grades = this.cartService.studentGrades(e.header_cells);
      console.log(e.header_cells);
    });
  }

  async ngOnInit() {
    this.users$ = this.cartService.getItems();

    this.userService.getStudents().subscribe((users) => {
      console.log(users[0]);
      this.data = users;
    });

    this.actService.getHeadersInfo().subscribe((e) => {
      this.value = e.header_cells;
      this.grades = this.cartService.studentGrades(e.header_cells);
      console.log(e.header_cells);
    });
  }

  Search = this.fb.group({
    name: [""],
    minPoints: [null],
    maxPoints: [null],
  });

  onSubmit() {
    this.SearchNick = this.Search.value.name;
    this.pointsMin = this.Search.value.minPoints;
    this.pointsMax = this.Search.value.maxPoints;
    console.log(this.Search.value);
  }

  public saveDataInCSV(name: string): void {
    const csvContent = this._csvService.saveDataInCSV(
      this.data,
      this.grades,
      this.value[this.value.length - 1]
    );

    const hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvContent);
    hiddenElement.target = "_blank";
    hiddenElement.download = name + ".csv";
    hiddenElement.click();
  }
}
