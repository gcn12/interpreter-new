import { AST, Print, VarDeclaration } from "./ast";
import { Token } from "./token";

export class Parser {
  tokens: Token[];
  current: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse(): AST[] {
    const statements: AST[] = [];

    while (this.current < this.tokens.length) {
      statements.push(this.varDeclaration());
    }

    return statements;
  }

  varDeclaration() {
    const token = this.getToken();
    if (token.type === "keyword" && token.literal === "let") {
      this.advance();
      const indentifier = this.expression();

      this.consume("=", "Expected =");

      const value = this.binary();

      this.consume(";", "Expected ;");

      const varDeclaration: VarDeclaration = {
        variable: indentifier,
        value,
        type: "varDeclaration",
      };

      return varDeclaration;
    }

    return this.statement();
  }

  statement() {
    const token = this.getToken();
    if (token.type === "keyword") {
      if (token.literal === "print") {
        this.advance();
        const exp = this.binary();
        const print: Print = { type: "print", value: exp };
        this.consume(";", "Expected: ;");
        return print;
      }
    }

    return this.binary();
  }

  binary() {
    let exp: AST = this.factor();
    while (this.current < this.tokens.length) {
      const token = this.getToken();
      if (token.type !== "-" && token.type !== "+") {
        break;
      }
      this.advance();

      const binary: AST = {
        left: exp,
        operator: token.type,
        right: this.binary(),
        type: "binary",
      };
      exp = binary;
    }

    return exp;
  }

  factor() {
    let exp: AST = this.expression();
    while (this.current < this.tokens.length) {
      const token = this.getToken();
      if (token.type !== "*" && token.type !== "/") {
        break;
      }
      this.advance();

      const binary: AST = {
        left: exp,
        operator: token.type,
        right: this.factor(),
        type: "binary",
      };
      exp = binary;
    }

    return exp;
  }

  expression(): AST {
    const token = this.getToken();

    switch (token.type) {
      case "int": {
        const exp: AST = { value: token.literal, type: "int" };
        this.advance();
        return exp;
      }

      case "indentifier": {
        const exp: AST = { value: token.literal, type: "indentifier" };
        this.advance();
        return exp;
      }

      case "keyword": {
        const exp: AST = { value: token.literal, type: "keyword" };
        this.advance();
        return exp;
      }

      case "string": {
        const exp: AST = { value: token.literal, type: "string" };
        this.advance();
        return exp;
      }
    }

    throw new Error("invalid expression");
  }

  consume(type: string, errMessage: string) {
    if (type !== this.getToken().type) {
      throw new Error(errMessage);
    }

    this.advance();
  }

  getToken() {
    return this.tokens[this.current];
  }

  advance() {
    this.current++;
  }
}
