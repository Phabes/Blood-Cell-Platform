export interface Activity {
  _id: string;
  name: string;
  grades: Array<number>;
  max_points: number;
  deadline: Date;
  created_on: Date;
}
