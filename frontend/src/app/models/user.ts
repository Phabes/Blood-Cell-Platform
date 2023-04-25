import { Grade } from "./grade";
import { Message } from "./message";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  nick: string;
  github: string;
  messages: Array<Message>;
  grades: Array<Grade>;
}
