export interface Int {
  value: number;
  type: "int";
}

export interface Binary {
  left: Int;
  operator: string;
  right: Int;
  type: "binary";
}

export type AST = Int | Binary;
