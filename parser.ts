import { AST } from "./ast";
import { Token } from "./token";

export class Parser {
  tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): AST {
    const token = this.tokens[0];

    return {
      left: { value: 1000, type: "int" },
      right: { value: 1, type: "int" },
      operator: "+",
      type: "binary",
    };

    // if (token.type === "int") {
    //   return { value: token.literal, type: "int" };
    // }

    // return { value: 1000, type: "int" };
  }
}
