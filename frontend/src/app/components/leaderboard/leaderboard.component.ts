import { Component, NgModule } from "@angular/core";
import { combineLatest, map, Observable, subscribeOn } from "rxjs";
import { LeaderBoardService, User } from "src/app/services/leaderboard.service";
import { CsvService } from 'src/app/services/csv.service';
import { Student } from "src/app/models/student";
import { UserService } from "src/app/services/user.service";
// import { StudentFilterPipe } from "src/app/student-filter.pipe";
import { FormControl, NgModel } from "@angular/forms";
import { ActivitiesService, Cells, Results  } from "src/app/services/activities.service";
import { leadingComment } from "@angular/compiler";



@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent {
  users$!: Observable<Student[]>;
  filteredUsers$: Observable<Student[]> | undefined;
  pointsMax = new FormControl<number>(1000000);
  pointsMin = new FormControl<number>(0);
  data!: Student[]; 
  
  value!: Cells[][];
  grades!: { nick: String; grades: (number | null)[]; }[];
 
  
   async ngOnInit() {
    this.users$ = this.cartService.getItems();
   
    this.userService.getStudents().subscribe(users => {console.log(users[0]); 
      this.data = users});
  
      this.actService.getHeadersInfo().subscribe(e =>{
        this.value = e.header_cells
       this.grades = this.cartService.studentGrades( e.header_cells)
       console.log(e.header_cells)
      } 
      );
  }



  constructor(private cartService: LeaderBoardService ,private _csvService: CsvService , private userService: UserService , private actService : ActivitiesService) {

   
  
  }

  getStudentGrades(){

  }
  public saveDataInCSV(name: string): void {
   
  
    let csvContent = this._csvService.saveDataInCSV(this.data);

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
    hiddenElement.target = '_blank';
    hiddenElement.download = name + '.csv';
    hiddenElement.click();
  }
}
