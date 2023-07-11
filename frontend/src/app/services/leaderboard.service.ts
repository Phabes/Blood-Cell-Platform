import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SERVER_NAME } from "src/env/env";
import { Student } from "../models/student";
import { Observable } from "rxjs";
import { ActivitiesService } from "./activities.service";
import { Cell } from "../models/cell";

@Injectable({
  providedIn: "root",
})
export class LeaderBoardService {
  items: Observable<Student[]>;
  value!: Cell[];

  constructor(private http: HttpClient, private actService: ActivitiesService) {
    this.items = this.getItems();
  }

  getItems() {
    return this.http.get<Student[]>(`${SERVER_NAME}/user/students`);
  }

  studentGrades(
    value: Cell[][],
    hiddenCategories: string[]
  ): {
    nick: string;
    grades: Array<number | null>;
    sumPoints: number;
  }[] {
    const result: {
      nick: string;
      grades: Array<number | null>;
      sumPoints: number;
    }[] = [];
    this.actService.getHeadersInfo(hiddenCategories).subscribe((e) => {
      this.value = e.header_cells[length - 1];
      this.items.subscribe((student) => {
        for (let i = 0; i < student.length; i++) {
          result.push({
            nick: student[i].nick,
            grades: [],
            sumPoints: 0,
          });

          value[value.length - 1].forEach((e) => {
            let tmp = null;
            for (let k = 0; k < student[i].grades.length; k++) {
              if (student[i].grades[k].activity === e.id) {
                tmp = student[i].grades[k].grade;
              } else if (tmp == null) {
                tmp = null;
              }
            }
            result[i].grades.push(tmp);
            if (tmp !== null) result[i].sumPoints += Number(tmp);
          });
        }
      });
    });

    return result;
  }
}
