export type Token =
  | {
      type: "=" | "/" | "*" | "-" | "+" | ";";
    }
  | { type: "int"; literal: number }
  | { type: "indentifier"; literal: string }
  | { type: "keyword"; literal: string };
