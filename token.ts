export type Token =
  | {
      type: "=" | "/" | "*" | "-" | "+" | ";";
    }
  | { type: "int"; literal: number }
  | { type: "indentifier"; literal: string }
  | { type: "string"; literal: string }
  | { type: "keyword"; literal: string };
