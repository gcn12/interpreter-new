export type Int = {
  literal: number;
  type: "int";
};

export const keywords: Record<string, boolean> = {
  let: true,
  print: true,
} as const;

export type Keyword = {
  literal: keyof typeof keywords;
  type: "keyword";
};

export type Indentifier = {
  literal: string;
  type: "indentifier";
};

export type Operator =
  | {
      literal: "+";
      type: "plus";
    }
  | {
      literal: "-";
      type: "minus";
    }
  | {
      literal: "*";
      type: "multiply";
    }
  | {
      literal: "/";
      type: "divide";
    };

export type Assignment = {
  literal: "=";
  type: "equals";
};

export type Token =
  | Int
  | Operator
  | Keyword
  | Indentifier
  | Assignment
  | { type: "semicolon"; literal: ";" };
