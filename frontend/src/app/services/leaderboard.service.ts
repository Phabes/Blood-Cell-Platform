import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SERVER_NAME } from "src/env/env";
import { Student } from "../models/student";
import { Observable } from "rxjs";
import { ActivitiesService, Cells } from "./activities.service";

export { User };
interface User {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  nick: string,
  github: string,
  messages: Array<Object>,
  grades: Array<{
    id: string,
    grade: number|null}>
}

@Injectable({
  providedIn: "root",
})
export class LeaderBoardService {
  items: Observable<Student[]>; 
  value!: Cells[]; 

  constructor(private http: HttpClient , private actService : ActivitiesService) {
    this.items = this.getItems();
 
  }

  getItems() {
    return  this.http.get<Student[]>(`${SERVER_NAME}/user/students`);
  }



  studentGrades(value: Cells[][]): {
      nick: string;
      grades: Array<
          number|null
        >
    }[]{
    const result: { nick: string;
        grades: Array<
          number|null
        >; }[] = [];
    this.actService.getHeadersInfo().subscribe(e =>{
      this.value = e.header_cells[length-1];
      this.items.subscribe(student=>{
        for (let i =0 ; i < student.length ; i++){
          result.push({
            nick: student[i].nick,
            grades: []
          });
          //  console.log(student[i] , value , value.length)
          //  console.log(value[value.length-1])
          value[value.length-1].forEach( e =>
          {
            let tmp = null;
            for(let k =0 ; k< student[i].grades.length  ; k++){

              if( student[i].grades[k].activity === e.id){
                tmp = student[i].grades[k].grade; 
                    
                    
              }   
              else if (tmp == null){
              
                tmp = null;
              }

            }
              result[i].grades!.push(tmp);
          });
          
        }
        
      });
    });
      
    return result;
  }

}
