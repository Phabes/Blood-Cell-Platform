export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  nick: string;
  email: string;
  github: string;
  messages: Array<Object>;
  grades: Array<{
    activity: string,
    grade: number | null
  }>
}
