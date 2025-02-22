import { AST } from "./ast";

export class Eval {
  variables: Record<string, number>;

  constructor() {
    this.variables = {};
  }

  run(astList: AST[]) {
    for (let i = 0; i < astList.length; i++) {
      this.evaluate(astList[i]);
    }
  }

  evaluate(node: AST) {
    switch (node.type) {
      case "int": {
        return node.value;
      }
      case "binary": {
        if (node.operator === "+") {
          return this.evaluate(node.left) + this.evaluate(node.right);
        } else if (node.operator === "-") {
          return this.evaluate(node.left) - this.evaluate(node.right);
        } else if (node.operator === "*") {
          return this.evaluate(node.left) * this.evaluate(node.right);
        } else if (node.operator === "/") {
          return this.evaluate(node.left) / this.evaluate(node.right);
        }
        break;
      }
      case "varDeclaration": {
        const val = this.evaluate(node.value);
        if (node.variable.type === "indentifier") {
          this.variables[node.variable.value] = val;
        }

        break;
      }
      case "indentifier": {
        return this.variables[node.value];
      }
      case "print": {
        console.log(this.evaluate(node.value));
      }
    }
  }
}
