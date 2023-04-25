export interface Category {
  _id: string;
  name: string;
  created_on: Date;
  col_span: number | null;
  row_span: number | null;
  level: number | null;
  sub_categories: Array<string>;
  activities: Array<string>;
}
