import { Message } from "./message";

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  nick: string;
  email: string;
  github: string;
  messages: Array<Message>;
  grades: Array<{
    activity: string;
    grade: number | null;
  }>;
}
