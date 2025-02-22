export type Int = {
  value: number;
  type: "int";
};

export type Identifier = {
  value: string;
  type: "indentifier";
};

export type Keyword = {
  value: string;
  type: "keyword";
};

export type VarDeclaration = {
  variable: AST;
  value: AST;
  type: "varDeclaration";
};

export type Binary = {
  left: AST;
  operator: "+" | "-" | "*" | "/";
  right: AST;
  type: "binary";
};

export type Print = {
  value: AST;
  type: "print";
};

export type AST = Int | Binary | Identifier | VarDeclaration | Keyword | Print;
