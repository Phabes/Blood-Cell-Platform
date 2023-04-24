import { Component, NgModule } from "@angular/core";
import { combineLatest, map, Observable, subscribeOn } from "rxjs";
import { LeaderBoardService, User } from "src/app/services/leaderboard.service";
import { CsvService } from 'src/app/services/csv.service';
import { Student } from "src/app/models/student";
import { UserService } from "src/app/services/user.service";
// import { StudentFilterPipe } from "src/app/student-filter.pipe";
import { FormBuilder, FormControl, NgModel, Validators } from "@angular/forms";
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
  pointsMax : number | null| undefined;
  pointsMin : number | null |undefined;
  data!: Student[]; 
  
  value!: Cells[][];
  grades!: { nick: String; grades: (number | null)[]; }[];
  SearchNick: any;


  
  async change(event: any, student_name: String, new_grade: number | null, j:number) {
    //  const j = 0;
    //  const student_name = "Huan";
    //  const new_grade = 5;
    console.log(event.target.value, student_name , j);
      if (event.target.value){
        var idx = this.value.length;
        const act = this.value[idx-1][j].id; // 
        this.userService.changeGrade(student_name, event.target.value , act);
      }
  
  
      this.userService.getStudents().subscribe(users => {console.log(users[0]); 
        this.data = users});
    
        this.actService.getHeadersInfo().subscribe(e =>{
          this.value = e.header_cells
         this.grades = this.cartService.studentGrades( e.header_cells)
         console.log(e.header_cells)
        } 
        );
    }
    
    
  
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



  constructor(private fb: FormBuilder, private cartService: LeaderBoardService ,private _csvService: CsvService , private userService: UserService , private actService : ActivitiesService) {
  
  }

  Search = this.fb.group(
    {
      name: [""],  
      minPoints: [null],
      maxPoints : [null]
    }
  );


    onSubmit() {
     
      this.SearchNick = this.Search.value.name
      this.pointsMin = this.Search.value.minPoints
      this.pointsMax = this.Search.value.maxPoints
      console.log( this.Search.value)
    }


  public saveDataInCSV(name: string): void {
   


    let csvContent = this._csvService.saveDataInCSV(this.data, this.grades, this.value[this.value.length-1]);

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
    hiddenElement.target = '_blank';
    hiddenElement.download = name + '.csv';
    hiddenElement.click();
  }
}
