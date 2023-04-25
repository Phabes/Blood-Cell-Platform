import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_NAME } from 'src/env/env';
import { Category } from '../models/category';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  items: Category[] = [];

  constructor(private http: HttpClient) {}

  addToCart(category: Category) {
    this.items.push(category);
  }

  getItems() {
    return this.http.get<{ date: Date; task: string; points: number }[]>(
      '../assets/categories.json'
    );
  }

  addCategory_noAboveCategoryChosen(data: any): Observable<any> {
    const newCategory = {
      name: data.name,
      created_on: new Date(),
    } as Category;
    return this.http.post<any>(
      `${SERVER_NAME}/category/add`,
      newCategory,
      httpOptions
    );
  }

  addCategory_AboveCategoryChosen(data: any, _id: string): Observable<any> {
    const above_categoryID = data.categoryID;
    const categoryID = _id;
    const request = {
      categoryID: above_categoryID,
      subcategoryID: categoryID,
    };
    return this.http.post<any>(
      `${SERVER_NAME}/category/assign_subcategory`,
      request,
      httpOptions
    );
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${SERVER_NAME}/category/all`);
  }
}
