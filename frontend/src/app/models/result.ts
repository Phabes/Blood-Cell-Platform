import { Cell } from "./cell";

export interface Result {
  header_width: number;
  header_height: number;
  header_cells: Cell[][];
}
