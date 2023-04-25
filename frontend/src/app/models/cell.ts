export interface Cell {
  id: string;
  name: string;
  row_span: number;
  col_span: number;
  max_points: number;
  deadline: Date|null;
}
