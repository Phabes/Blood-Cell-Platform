import { Pipe, PipeTransform } from "@angular/core";



@Pipe({ name: "simpleSearch" })
export class SimpleSearchPipe implements PipeTransform {

  public transform(value: any, keys: string, term: string) {

    if (!term) return value;
    return (value || [])
      .filter((item: any) =>{ 
      
        return  item !== undefined && ( String(item.nick).includes(String(term)) ); 
      }
      );
  }

}