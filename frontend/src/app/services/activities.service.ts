import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_NAME } from 'src/env/env';

export { Activity };
interface Activity {
  date: Date;
  task: string;
  points: number;
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

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  items: Activity[] = [];
  constructor(private http: HttpClient) {}

  addToCart(activity: Activity) {
    this.items.push(activity);
  }

  getItems() {
    return this.http.get<{ date: Date; task: string; points: number }[]>(
      '../assets/activities.json'
    );
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

  private getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${SERVER_NAME}/category/all`);
  }

  getHeadersInfo() {
    this.getCategories().subscribe((categories) => {
      let width: number = 0;
      let height: number = 0;
      let mainCategories: Array<String> = [];
      let subCategories: Array<String> = [];
      
      // Get info about root categories and width of the header
      categories.forEach((category: Category) => {
        category.row_span = null;
        category.col_span = null;
        category.level = 0;
        mainCategories.push(category._id);
        subCategories.push(...category.sub_categories);
        width += category.activities.length;
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
      
      console.log(this.getHeaderInfoOutput(mainCategories, categories, height, width));
      return this.getHeaderInfoOutput(mainCategories, categories, height, width);
    });
  }

  computeCategoryColSpanAndLevel(
    id: String,
    categories: Category[],
    level: number
  ): number {
    let category: Category = categories.filter((cat) => {return cat._id === id;})[0];
    category.level = Math.max(category.level!, level);
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
      return category.col_span;
    }

    let col_span: number = 0;
    category.sub_categories.forEach((cat_id: String) => {
      col_span += this.computeCategoryColSpanAndLevel(
        cat_id,
        categories,
        level + 1
      );
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
      height = Math.max(height, cat_info.level);
      let category: Category = categories.filter((cat) => {
        return cat._id === cat_info.id;
      })[0];
      category.sub_categories.forEach((cat_id) =>
        categoriesWithLevel.push({ id: cat_id, level: cat_info.level + 1 })
      );
    }

    return height;
  }

  computeCategoryRowSpan(categories: Category[], height: number) {
    categories.forEach((category) => {
      if (category.sub_categories.length > 0) {
        category.row_span = 1;
      } else if (
        category.activities.length > 0 &&
        category.sub_categories.length === 0
      ) {
        category.row_span = height - category.level! + 1;
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
  ): Object {
    let header_categories: {
      id: String;
      name: String;
      row_span: number;
      col_span: number;
    }[][] = [];
    let nextCategories: Array<String> = [];
    nextCategories = mainCategories;
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
        category.sub_categories.forEach(id => tempCategories.push(id));
      });
      nextCategories = tempCategories.slice();
    }

    return {
      header_width: width,
      header_height: height,
      header_cells: header_categories,
    };
  }
}
