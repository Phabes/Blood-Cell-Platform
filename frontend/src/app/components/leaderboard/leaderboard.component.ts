import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Options } from "src/app/models/options";
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
  hidden_cols!: boolean[];
  mess: string | undefined;
  value!: Cell[][];
  grades!: { nick: string; grades: (number | null)[]; sumPoints: number }[];
  SearchNick: any;
  generalMaxPoints = 0;

  options: Options = {
    orderBy: "Name",
    orderDir: "ASC",
    page: 1,
    size: 20,
  };
  logsSize = 0;
  lowerLimit = 0;
  upperLimit = 0;
  isAsc = false;
  last_sort = "";
  isTeacher = false;
  hiddenCategories: string[] = [];

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
    console.log(event.target.value, student_name, j);

    const idx = this.value.length;
    const act = this.value[idx - 1][j].id;
    const max_points = this.value[idx - 1][j].max_points;

    if (
      (event.target.value === "" || event.target.value >= 0) &&
      event.target.value <= max_points
    ) {
      this.userService
        .changeGrade(student_name, event.target.value, act)
        .subscribe((data) => {
          console.log(data);
        });
    } else {
      window.alert("Wrong points number!");
    }

    this.userService.getStudents().subscribe((users) => {
      this.data = users;
    });

    this.actService.getHeadersInfo(this.hiddenCategories).subscribe((e) => {
      this.value = e.header_cells;
      this.grades = this.cartService.studentGrades(
        e.header_cells,
        this.hiddenCategories
      );
    });
  }

  async ngOnInit() {
    this.users$ = this.cartService.getItems();

    this.userService.getStudents().subscribe((users) => {
      this.data = users;
      this.logsSize = users.length;
    });

    this.actService.getHeadersInfo(this.hiddenCategories).subscribe((e) => {
      this.value = e.header_cells;
      this.grades = this.cartService.studentGrades(
        e.header_cells,
        this.hiddenCategories
      );
    });

    this.getPoints();

    this.reload();
    if (this.userService.getUserRole() == "teacher") {
      this.isTeacher = true;
    }
  }

  getPoints() {
    const act = this.actService.getActivities().toPromise();
    act.then((e) => {
      if (e != undefined) {
        for (let i = 0; i < e.length; i++) {
          if (!this.hiddenCategories.includes(e[i]._id))
            this.generalMaxPoints += e[i].max_points;
        }
      }
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

  public hintDeadline(cell: Cell) {
    if (cell.deadline) {
      const date = new Date(cell.deadline);
      return "Due to " + date.toLocaleDateString("en-GB");
    }
    return "";
  }

  public isPastDeadlineColor(cell: Cell): string {
    if (cell.deadline) {
      const date = new Date(cell.deadline).getTime();
      const now = new Date().getTime();
      if (now > date) return "rgba(72, 72, 72, 0.355)";
      else return "rgba(255, 248, 47, 0.411)";
    }
    return "auto";
  }

  public isPastDeadlineIcon(cell: Cell): boolean {
    if (cell.deadline) {
      const date = new Date(cell.deadline).getTime();
      const now = new Date().getTime();
      if (now > date) return true;
      return false;
    }
    return false;
  }

  reload() {
    this.userService.getStudents().subscribe((users) => {
      this.logsSize = users.length;
      this.lowerLimit = (this.options.page - 1) * this.options.size;
      this.upperLimit = Math.min(
        users.length,
        (this.options.page - 1) * this.options.size + this.options.size
      );

      this.data = users.slice(
        (this.options.page - 1) * this.options.size,
        Math.min(
          users.length,
          (this.options.page - 1) * this.options.size + this.options.size
        )
      );
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

  hide() {
    //e.target.style.width = '10%';
    //e.target.style.setProperty('text-indent', '100%');
    //e.target.style.setProperty('white-space', 'nowrap');
    //e.target.style.setProperty('overflow', 'hidden');
  }

  sortByName() {
    if (this.last_sort == "name") {
      this.isAsc = !this.isAsc;
    }
    this.last_sort = "name";
    const slicedData = this.grades.slice();
    this.grades = slicedData.sort((a, b) => {
      return (a.nick < b.nick ? -1 : 1) * (this.isAsc ? 1 : -1);
    });
  }

  sortByActivityIndex(index: number) {
    if (this.last_sort == index.toString()) {
      this.isAsc = !this.isAsc;
    }
    this.last_sort = index.toString();
    const slicedData = this.grades.slice()!;
    this.grades = slicedData.sort((a, b) => {
      return (
        ((a.grades[index] || 0) < (b.grades[index] || 0) ? -1 : 1) *
        (this.isAsc ? 1 : -1)
      );
    });
    this.grades.sort;
  }

  sortBySum() {
    if (this.last_sort == "sum") {
      this.isAsc = !this.isAsc;
    }
    this.last_sort = "sum";
    const slicedData = this.grades.slice();
    this.grades = slicedData.sort((a, b) => {
      return (a.sumPoints < b.sumPoints ? -1 : 1) * (this.isAsc ? 1 : -1);
    });
  }

  get numbers(): number[] {
    const limit = Math.ceil(this.logsSize / this.options.size);
    return Array.from({ length: limit }, (_, i) => i + 1);
  }

  public hintHide(cell: Cell) {
    if (this.value[0].includes(cell)) {
      return "Hide category";
    }

    return "";
  }

  hideCategory(category: Cell) {
    if (this.value[0].includes(category)) {
      this.hiddenCategories.push(category.id);

      this.actService.getHeadersInfo(this.hiddenCategories).subscribe((e) => {
        this.value = e.header_cells;
        this.grades = this.cartService.studentGrades(
          e.header_cells,
          this.hiddenCategories
        );
      });
      this.mess = "Category " + category.name + " is hidden";
    }
  }

  clearHiddenCategories() {
    this.hiddenCategories = [];
    this.actService.getHeadersInfo(this.hiddenCategories).subscribe((e) => {
      this.value = e.header_cells;
      this.grades = this.cartService.studentGrades(
        e.header_cells,
        this.hiddenCategories
      );
    });
  }
}
