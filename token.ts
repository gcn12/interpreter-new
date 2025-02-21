export interface Int {
  literal: number;
  type: "int";
}

export interface Operator {
  literal: "+";
  type: "plus";
}

export type Token = Int | Operator;
