import { Component, NgModule } from "@angular/core";
import { combineLatest, map, Observable, subscribeOn } from "rxjs";
import { LeaderBoardService } from "src/app/services/leaderboard.service";
import { CsvService } from 'src/app/services/csv.service';
import { Student } from "src/app/models/student";
import { UserService } from "src/app/services/user.service";
import { StudentFilterPipe } from "src/app/student-filter.pipe";
import { FormControl, NgModel } from "@angular/forms";
import { ActivitiesService, Cells, Results  } from "src/app/services/activities.service";
import { leadingComment } from "@angular/compiler";



@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent {
  users$!: Observable<{ nick: string; points: number; }[]>;
  filteredUsers$: Observable<{ nick: string; points: number; }[]> | undefined;
  pointsMax = new FormControl<number>(1000000);
  pointsMin = new FormControl<number>(0);
  data!: Student[]; 
  
  value!: Cells[][];
 
  
   async ngOnInit() {
    this.users$ = this.cartService.getItems();
 
    
  
  }



  constructor(private cartService: LeaderBoardService ,private _csvService: CsvService , private userService: UserService , private actService : ActivitiesService) {

    this.users$ = this.cartService.getItems();
    console.log(this.users$)
    this.addFilters();
    console.log(this.filteredUsers$)
    this.userService.getStudents().subscribe(users => this.data = users);
    this.actService.getHeadersInfo().subscribe(e =>{
      this.value = e.header_cells
     
    } 
    );

  }


 
  addFilters(){
    
    this.filteredUsers$ = this.users$.pipe(
      map(sellers => sellers.filter(seller => 
            seller.points > this.pointsMin.value! && seller.points < this.pointsMax.value!
          
       
        )),
      map(sellers => {
          return sellers.map(seller => {
            console.log(seller.nick)
            return {
              nick: seller.nick,
              points: seller.points
            }
         });
      })); 
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
