import { AST } from "./ast";

export class Eval {
  root: AST;

  constructor(root: AST) {
    this.root = root;
  }

  evaluate(node: AST) {
    console.log(node);
    switch (node.type) {
      case "int": {
        return node.value;
      }
      case "binary": {
        if (node.operator === "+") {
          return node.left.value + node.right.value;
        }
        break;
      }
    }
  }
}
