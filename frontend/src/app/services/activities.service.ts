import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, firstValueFrom } from "rxjs";
import { SERVER_NAME } from "src/env/env";
import { Activity } from "../models/activity";
import { Result } from "../models/result";
import { Category } from "../models/category";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
  withCredentials: true,
};

@Injectable({
  providedIn: "root",
})
export class ActivitiesService {
  items: Activity[] = [];
  constructor(private http: HttpClient) {}
  value: object | undefined;

  addToCart(activity: Activity) {
    this.items.push(activity);
  }

  getItems() {
    return this.http.get<{ date: Date; task: string; points: number }[]>(
      "../assets/activities.json"
    );
  }

  async addActivity(data: any) {
    const newActivity = {
      name: data.name,
      max_points: data.max_points,
      deadline: data.deadline,
      created_on: new Date(),
    } as Activity;
    try {
      const response = await firstValueFrom(this.http.post<any>(`${SERVER_NAME}/activity/add`, newActivity, httpOptions));

      const categoryID = data.categoryID;
      const request = {
        categoryID: categoryID,
        activityID: response._id,
      };

      const finalResponse = await firstValueFrom(this.http.post<any>(`${SERVER_NAME}/category/assign_activity`,request,httpOptions,));
      return finalResponse.action;
        
    } catch (error) {
      console.log("Something wrong!");
      return "SERWER ERROR";
    }
      
      
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
    const subject = new Subject<Array<{ name: string; id: string }>>();
    this.getCategories().subscribe((categories) => {
      let mainCategories: Array<{ name: string; id: string }> = [];
      const subCategories: Array<string> = [];

      categories.forEach((category: Category) => {
        mainCategories.push({ name: category.name, id: category._id });
        subCategories.push(...category.sub_categories);
      });
      mainCategories = mainCategories.filter(({ name: name, id: id }) => {
        return !subCategories.includes(id);
      });

      subject.next(mainCategories);
    });
    return subject.asObservable();
  }

  getHeadersInfo() {
    const subject = new Subject<Result>();
    this.getCategories().subscribe((categories) => {
      let width = 0;
      let height = 0;
      let mainCategories: Array<string> = [];
      const subCategories: Array<string> = [];
      const activities: Array<Activity> = [];

      // Get info about root categories and width of the header
      categories.forEach((category: Category) => {
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
      mainCategories.forEach((cat_id: string) => {
        const category: Category = categories.filter((cat) => {
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
      subject.next(
        this.getHeaderInfoOutput(mainCategories, categories, height, width)
      );
    });
    return subject.asObservable();
  }

  computeCategoryColSpanAndLevel(
    id: string,
    categories: Category[],
    level: number
  ): number {
    const category: Category = categories.filter((cat) => {
      return cat._id === id;
    })[0];
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

    let col_span = 0;
    category.sub_categories.forEach((cat_id: string) => {
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
    mainCategories: Array<string>,
    categories: Category[]
  ): number {
    let height = 0;
    const categoriesWithLevel: Array<{ id: string; level: number }> = [];
    mainCategories.forEach((id: string) =>
      categoriesWithLevel.push({ id: id, level: 1 })
    );
    while (categoriesWithLevel.length !== 0) {
      const cat_info: { id: string; level: number } =
        categoriesWithLevel.shift()!;

      height = Math.max(height, cat_info.level);
      const category: Category = categories.filter((cat) => {
        return cat._id === cat_info.id;
      })[0];
      if (category.activities.length > 0) {
        height = Math.max(height, cat_info.level + 1);
      }
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
        category.row_span = height - category.level!;
      } else {
        category.row_span = 0;
      }
    });
  }

  getHeaderInfoOutput(
    mainCategories: Array<string>,
    categories: Category[],
    height: number,
    width: number
  ): Result {
    const header_categories: {
      id: string;
      name: string;
      row_span: number;
      col_span: number;
      max_points: number;
      deadline: Date|null;
    }[][] = [];
    let nextCategories: Array<string> = [];
    nextCategories = mainCategories;
    this.getActivities().subscribe((act) => {
      header_categories[height] = [];
      for (let i = 0; i < height; i++) {
        header_categories[i] = [];
        const tempCategories: Array<string> = [];
        nextCategories.forEach((cat_id) => {
          const category: Category = categories.filter((cat) => {
            return cat._id === cat_id;
          })[0];
          header_categories[i].push({
            id: cat_id,
            name: category.name,
            row_span: category.row_span!,
            col_span: category.col_span!,
            max_points: 0,
            deadline: null,
          });
          category.sub_categories.forEach((id) => tempCategories.push(id));
        });

        nextCategories = tempCategories.slice();
      }

      // add activities in correct order
      mainCategories.forEach((cat_id) => {
        const cat: Category = categories.filter((cat) => {
          return cat._id === cat_id;
        })[0];
        this.fillHeaderActivitiesInfo(
          cat,
          categories,
          act,
          height,
          header_categories
        );
      });

      //console.log(header_categories[height])
    });

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
    header_categories: Object[][]
  ) {
    category.activities.forEach((id) => {
      const activity = activities.filter((category) => {
        return category._id === id;
      })[0];
      if (activity != null) {
        header_categories[height].push({
          id: activity._id,
          name: activity.name,
          row_span: 1,
          col_span: 1,
          max_points: activity.max_points,
          deadline: activity.deadline
        });
      }
    });
    category.sub_categories.forEach((cat_id) => {
      const next_cat: Category = categories.filter((cat) => {
        return cat._id === cat_id;
      })[0];
      this.fillHeaderActivitiesInfo(
        next_cat,
        categories,
        activities,
        height,
        header_categories
      );
    });
  }
}
