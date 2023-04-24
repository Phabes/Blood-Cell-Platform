import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, Subject, tap } from "rxjs";
import { SERVER_NAME } from "src/env/env";
 
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
  withCredentials: true,
};

export { Category };
interface Category {
  _id: string;
  name: string;
  created_on: Date;
  col_span: number | null;
  row_span: number | null;
  level: number | null;
  sub_categories: Array<string>;
  activities: Array<string>;
}
 
export { Results };
interface Results{
      header_width: number,
      header_height: number,
      header_cells:  Cells[][],
}

export{Cells};
interface Cells{
  
    id: string,
    name: string,
    row_span: number,
    col_span: number,
    max_points: number
  }
 @Injectable({
   providedIn: "root",
 })

export class CategoriesService {
  items: Category[] = [];
  constructor(private http: HttpClient) {}
  value: Object | undefined;
  addToCart(category: Category) {
    this.items.push(category);
  }
 
  getItems() {
    return this.http.get<{ date: Date; task: string; points: number }[]>(
      "../assets/categories.json"
    );
  }

  addCategory_noAboveCategoryChosen(data: any) {
    const newCategory = {
      name: data.name,
      created_on: new Date(),
    } as Category;
    this.http.post<any>(
      `${SERVER_NAME}/category/add`,
      newCategory,
      httpOptions
    ).subscribe();
  }

  addCategory_AboveCategoryChosen(data: any) {
    const newCategory = {
      name: data.name,
      created_on: new Date(),
    } as Category;
    this.http.post<any>(
      `${SERVER_NAME}/category/add`,
      newCategory,
      httpOptions
    ).subscribe(response => {
      const above_categoryID = data.categoryID;
      const categoryID = response._id;
      const request = {
        categoryID: above_categoryID,
        subcategoryID: categoryID 
      };
      this.http.post<any>(
        `${SERVER_NAME}/category/assign_subcategory`,
        request,
        httpOptions
      ).subscribe(res => {
        console.log(res);
      });
    });
    
  }
 
  clearCart() {
    this.items = [];
    return this.items;
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${SERVER_NAME}/category/all`);
  }



}