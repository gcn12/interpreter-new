export type Token =
  | {
      type: "equals" | "divide" | "multiply" | "minus" | "plus" | "semicolon";
    }
  | { type: "int"; literal: number }
  | { type: "indentifier"; literal: string }
  | { type: "keyword"; literal: string };
