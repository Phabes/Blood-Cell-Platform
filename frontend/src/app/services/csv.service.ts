import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class CsvService {

  constructor() { }


  public saveDataInCSV(data: Array<any>): string {
    if (data.length == 0) {
      return "";
    }

    const propertyNames = Object.keys(data[0]);
    const rowWithPropertyNames = propertyNames.join(",") + "\n";

    let csvContent = rowWithPropertyNames;

    const rows: string[] = [];

    data.forEach((item) => {
      const values: string[] = [];

      propertyNames.forEach((key) => {
        let val: any = item[key];

        if (val !== undefined && val !== null) {
          val = new String(val);
        } else {
          val = "";
        }
        values.push(val);
      });
      rows.push(values.join(","));
    });
    csvContent += rows.join("\n");

    return csvContent;
  }
}
