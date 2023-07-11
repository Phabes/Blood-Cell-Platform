import { Grade } from "./grade";

export interface Activity {
  _id: string;
  name: string;
  grades: Array<Grade>;
  max_points: number;
  deadline: Date;
  created_on: Date;
}
