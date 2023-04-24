import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }


  public saveDataInCSV(data: Array<any>, studentInfo: Array<any>, activities: Array<any>): string {
    if (data.length == 0) {
      return '';
    }

    let propertyNames = Object.keys(data[0]).filter(name => !["grades", "__v", "messages", "password"].includes(name));
    propertyNames =propertyNames.concat(activities.map(act => "grade_"+act.name));
    let rowWithPropertyNames = propertyNames.join(',') + '\n';
    
    let csvContent = rowWithPropertyNames;

    let rows: string[] = [];

    data.forEach((item, idx) => {
      let values: string[] = [];

      activities.map((act) => "grade_"+act.name).forEach((newKey, i) => {
        data[idx][newKey] = studentInfo[idx].grades[i];
      })

      propertyNames.forEach((key) => {
        if (["grades", "__v", "messages", "password"].includes(key)) return;
        let val: any = item[key];

        if (val !== undefined && val !== null) {
          val = new String(val);
        } else {
          val = '';
        }
        values.push(val);
      });

      rows.push(values.join(','));


    });
    csvContent += rows.join('\n');


    return csvContent;
  }

}

