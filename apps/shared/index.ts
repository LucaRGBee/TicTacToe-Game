export type Cell = 0 | 1 | -1;

export type Board = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
];

export type Iterable = 0 | 1 | 2;

export type ApiResponse = { [key: string]: Array<number> };
