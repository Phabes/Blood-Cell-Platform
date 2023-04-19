import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { SERVER_NAME } from 'src/env/env';
 
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
};

 export { Activity };
 interface Activity {
  _id: String;
   name: string;
   grades: Array<number>;
   max_points: number;
   deadline: Date;
   created_on: Date;
 }
 
export { Category };
interface Category {
  _id: String;
  name: String;
  created_on: Date;
  col_span: number | null;
  row_span: number | null;
  level: number | null;
  sub_categories: Array<String>;
  activities: Array<String>;
}
 
export { Results };
interface Results{
      header_width: number,
      header_height: number,
      header_cells:  Cells[][],
}
export{Cells}
interface Cells{
  
    id: String,
    name: String,
    row_span: number,
    col_span: number
  }
 @Injectable({
   providedIn: 'root',
 })
 export class ActivitiesService {
   items: Activity[] = [];
   constructor(private http: HttpClient) {}
   value: Object | undefined
   addToCart(activity: Activity) {
     this.items.push(activity);
   }
 
   getItems() {
     return this.http.get<{ date: Date; task: string; points: number }[]>(
       '../assets/activities.json'
     );
   }

   addActivity(data: any) {
    const newActivity = {
      name: data.name,
      max_points: data.maxPoints, 
      deadline: data.deadline,
      created_on: new Date(),
    } as Activity;

    this.http.post<any>(
      `${SERVER_NAME}/activity/add`,
      newActivity,
      httpOptions
    ).subscribe(response => {
      const categoryID = data.categoryID;
      const activityID = response._id;
      const request = {
        categoryID: categoryID,
        activityID: activityID
      }
      this.http.post<any>(
        `${SERVER_NAME}/category/assign`,
        request,
        httpOptions
      ).subscribe(res => {
        console.log(res);
      })
    })
    
   }
 
   clearCart() {
     this.items = [];
     return this.items;
   }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${SERVER_NAME}/category/all`);
  }
  private getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${SERVER_NAME}/activity/all`);
  }

  getMainCategories() {
    let subject = new Subject<Array<{name: String, id: String}>>();
    this.getCategories().subscribe((categories) => {
      let mainCategories: Array<{name: String, id: String}> = [];
      let subCategories: Array<String> = [];

      categories.forEach((category: Category) => {
          mainCategories.push({name: category.name, id: category._id});
          subCategories.push(...category.sub_categories);
        });
      mainCategories = mainCategories.filter(({name: name, id: id}) => {
        return !subCategories.includes(id);
      });

      subject.next(mainCategories);
    });
    return subject.asObservable()
  }

  getHeadersInfo() {
     var subject = new Subject<Results>();
     this.getCategories().subscribe((categories) => {
      let width: number = 0;
      let height: number = 0;
      let mainCategories: Array<String> = [];
      let subCategories: Array<String> = [];
      let activities: Array<Activity> = [];
      

      //console.log(categories)
      // Get info about root categories and width of the header
      categories.forEach((category: Category) => {
      //  console.log(category.activities)
        category.row_span = null;
        category.col_span = null;
        category.level = 0;
        mainCategories.push(category._id);
        subCategories.push(...category.sub_categories);
        width = category.activities.length;
      
        
      });
      mainCategories = mainCategories.filter((name) => {
        return !subCategories.includes(name);
      });

      // Traverse over categories tree and get info about cells width
      mainCategories.forEach((cat_id: String) => {
        let category: Category = categories.filter((cat) => {
          return cat._id === cat_id;
        })[0];
        category.col_span = this.computeCategoryColSpanAndLevel(
          category._id,
          categories,
          1
        );
      });

      //Traverse over categories tree and get max height
      height = this.computeCategoryMaxHeight(mainCategories, categories);
  
      // Traverse over categories and get cells height
      this.computeCategoryRowSpan(categories, height);
     // console.log(this.getHeaderInfoOutput(mainCategories, categories, height, width))
      subject.next (this.getHeaderInfoOutput(mainCategories, categories, height, width))
    });
    return subject.asObservable()
  }

  computeCategoryColSpanAndLevel(
    id: String,
    categories: Category[],
    level: number
  ): number {
    let category: Category = categories.filter((cat) => {return cat._id === id;})[0];
    category.level = Math.max(category.level!, level);
   // console.log(category.name  , category.col_span)
    if (category.col_span !== null) return category.col_span;
    if (
      category.activities.length === 0 &&
      category.sub_categories.length === 0
    ) {
      category.col_span = 0;
      return 0;
    }
    if (category.activities.length > 0) {
      category.col_span = category.activities.length;
      //console.log(category.name , category.activities)
      return category.col_span;
    }

    let col_span: number = 0;
    category.sub_categories.forEach((cat_id: String) => {
      col_span += this.computeCategoryColSpanAndLevel(
        cat_id,
        categories,
        level + 1
      );
      //console.log(col_span , cat_id)
    });

    category.col_span = col_span;
    return col_span;
  }

  computeCategoryMaxHeight(
    mainCategories: Array<String>,
    categories: Category[]
  ): number {
    let height = 0;
    let categoriesWithLevel: Array<{ id: String; level: number }> = [];
    mainCategories.forEach((id: String) => categoriesWithLevel.push({ id: id, level: 1 }));
    while (categoriesWithLevel.length !== 0) {
      let cat_info: { id: String; level: number } =
        categoriesWithLevel.shift()!;
      
      height = Math.max(height, cat_info.level );
      let category: Category = categories.filter((cat) => {
        return cat._id === cat_info.id;
      })[0];
      if (category.activities.length > 0 ){
        height =Math.max(height, cat_info.level +1 );
      } 
      category.sub_categories.forEach((cat_id) =>
        categoriesWithLevel.push({ id: cat_id, level: cat_info.level + 1 })
      );
    }

    return height;
  }

  computeCategoryRowSpan(categories: Category[], height: number) {
    //console.log(height)
    categories.forEach((category) => {
      if (category.sub_categories.length > 0 ) {
        category.row_span = 1;
      } else if (
        category.activities.length > 0 &&
        category.sub_categories.length === 0
      ) {
        category.row_span = height - category.level! ;
      } else {
        category.row_span = 0;
      }
    });
  }

  getHeaderInfoOutput(
    mainCategories: Array<String>,
    categories: Category[],
    height: number,
    width: number
  ): Results {
    let header_categories: {
      id: String;
      name: String;
      row_span: number;
      col_span: number;
    }[][] = [];
    let nextCategories: Array<String> = [];
    nextCategories = mainCategories;
    this.getActivities().subscribe((act) => {
      header_categories[height]=[]
      for (let i = 0; i < height; i++) {   

      header_categories[i] = [];
      let tempCategories: Array<String> = [];
      nextCategories.forEach( cat_id => {
        let category: Category = categories.filter((cat) => {return cat._id === cat_id;})[0];
        header_categories[i].push({
        
          id: cat_id,
          name: category.name,
          row_span: category.row_span!,
          col_span: category.col_span!,
        
        });
       
       // console.log(category.name)
       
        category.sub_categories.forEach(id => tempCategories.push(id));
        // category.activities.forEach(id => {

        //   console.log(header_categories[height])
         
        //     let activity = act.filter((cat) => {return cat._id === id})[0];
           
        //     if(activity != null ){
        //     header_categories[height].unshift({
        
        //         id:activity._id,
        //         name:activity.name,
        //         row_span: 1,
        //         col_span: 1,
              
        //       });
        //     }
        
        // })

        })

      nextCategories = tempCategories.slice();
    }
    
    // add activities in correct order
    mainCategories.forEach(cat_id => {
      let cat: Category = categories.filter((cat) => {return cat._id === cat_id;})[0];
      this.fillHeaderActivitiesInfo(cat, categories, act, height, header_categories);
    })

    //console.log(header_categories[height])

  })
 
    return {
    
      header_width: width,
      header_height: height,
      header_cells: header_categories,
    
    };
  }

  fillHeaderActivitiesInfo(
    category: Category,
    categories: Category[],
    activities: Activity[],
    height: number,
    header_categories: Object[][]){
      category.activities.forEach(id => {
          let activity = activities.filter((category) => {return category._id === id})[0];
          if(activity != null ){
          header_categories[height].push({
              id:activity._id,
              name:activity.name,
              row_span: 1,
              col_span: 1,
            });
          }
      
      })
        category.sub_categories.forEach(cat_id => {
          let next_cat: Category = categories.filter((cat) => {return cat._id === cat_id;})[0];
          this.fillHeaderActivitiesInfo(next_cat, categories, activities, height, header_categories);
        })
    }



 }