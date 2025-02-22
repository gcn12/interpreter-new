(() => {
  // eval.ts
  var Eval = class {
    variables;
    constructor() {
      this.variables = {};
    }
    run(astList2) {
      for (let i = 0; i < astList2.length; i++) {
        this.evaluate(astList2[i]);
      }
    }
    evaluate(node) {
      switch (node.type) {
        case "int": {
          return node.value;
        }
        case "string": {
          return node.value;
        }
        case "binary": {
          if (node.operator === "+") {
            return this.evaluate(node.left) + this.evaluate(node.right);
          }
          if (node.left.type !== "int" || node.right.type !== "int") {
            throw new Error("Cannot use math operations on strings");
          }
          if (node.operator === "-") {
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
  };

  // parser.ts
  var Parser = class {
    tokens;
    current;
    constructor(tokens2) {
      this.tokens = tokens2;
      this.current = 0;
    }
    parse() {
      const statements = [];
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
        if (this.getToken().type !== "=") {
          throw new Error("Expected =");
        }
        this.advance();
        const value = this.binary();
        if (this.getToken().type !== ";") {
          throw new Error("Expected ;");
        }
        this.advance();
        const varDeclaration = {
          variable: indentifier,
          value,
          type: "varDeclaration"
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
          const print = { type: "print", value: exp };
          if (this.getToken().type === ";") {
            this.advance();
            return print;
          } else {
            throw new Error("Expected: ;");
          }
        }
      }
      return this.binary();
    }
    binary() {
      let exp = this.factor();
      while (this.current < this.tokens.length) {
        const token = this.getToken();
        if (token.type !== "-" && token.type !== "+") {
          break;
        }
        this.advance();
        const binary = {
          left: exp,
          operator: token.type,
          right: this.binary(),
          type: "binary"
        };
        exp = binary;
      }
      return exp;
    }
    factor() {
      let exp = this.expression();
      while (this.current < this.tokens.length) {
        const token = this.getToken();
        if (token.type !== "*" && token.type !== "/") {
          break;
        }
        this.advance();
        const binary = {
          left: exp,
          operator: token.type,
          right: this.factor(),
          type: "binary"
        };
        exp = binary;
      }
      return exp;
    }
    expression() {
      const token = this.getToken();
      switch (token.type) {
        case "int": {
          const exp = { value: token.literal, type: "int" };
          this.advance();
          return exp;
        }
        case "indentifier": {
          const exp = { value: token.literal, type: "indentifier" };
          this.advance();
          return exp;
        }
        case "keyword": {
          const exp = { value: token.literal, type: "keyword" };
          this.advance();
          return exp;
        }
        case "string": {
          const exp = { value: token.literal, type: "string" };
          this.advance();
          return exp;
        }
      }
      throw new Error("invalid expression");
    }
    getToken() {
      return this.tokens[this.current];
    }
    advance() {
      this.current++;
    }
  };

  // scanner.ts
  var Scanner = class {
    tokens;
    source;
    start;
    current;
    keywords;
    constructor(source) {
      this.tokens = [];
      this.source = source;
      this.start = 0;
      this.current = 0;
      this.keywords = /* @__PURE__ */ new Set(["let", "print"]);
    }
    scan() {
      while (!this.isEOF()) {
        this.start = this.current;
        const c = this.getCurrentAndAdvance();
        switch (c) {
          case "+":
          case "-":
          case "*":
          case "/":
          case "=":
          case ";": {
            this.tokens.push({ type: c });
            break;
          }
          case " ": {
            break;
          }
          case '"': {
            this.tokens.push({
              type: "string",
              literal: this.scanString()
            });
            if (this.getCurrentChar() !== '"') {
              throw new Error('Expected: "');
            }
            this.advance();
            break;
          }
          default: {
            if (this.isNumeric(c)) {
              this.tokens.push({ literal: Number(this.scanInt()), type: "int" });
              break;
            } else if (this.isAlpha(c)) {
              const alphaNumeric = this.scanAlphaNumeric();
              if (this.keywords.has(alphaNumeric)) {
                this.tokens.push({ literal: alphaNumeric, type: "keyword" });
              } else {
                this.tokens.push({ literal: alphaNumeric, type: "indentifier" });
              }
              break;
            }
            throw new Error("Invalid character: " + this.getCurrentChar());
          }
        }
      }
      return this.tokens;
    }
    scanString() {
      while (!this.isEOF() && (this.isAlpha(this.getCurrentChar()) || this.isNumeric(this.getCurrentChar()) || this.getCurrentChar() === " ")) {
        this.advance();
      }
      return this.source.slice(this.start + 1, this.current);
    }
    scanAlphaNumeric() {
      while (!this.isEOF() && (this.isAlpha(this.getCurrentChar()) || this.isNumeric(this.getCurrentChar()))) {
        this.advance();
      }
      return this.source.slice(this.start, this.current);
    }
    scanInt() {
      while (!this.isEOF() && this.isNumeric(this.getCurrentChar())) {
        this.advance();
      }
      return this.source.slice(this.start, this.current);
    }
    isEOF() {
      return this.current >= this.source.length;
    }
    advance() {
      this.current++;
    }
    isAlpha(c) {
      return c.charCodeAt(0) - "a".charCodeAt(0) >= 0 && c.charCodeAt(0) - "z".charCodeAt(0) <= 25 || c.charCodeAt(0) - "A".charCodeAt(0) >= 0 && c.charCodeAt(0) - "Z".charCodeAt(0) <= 25;
    }
    isNumeric(c) {
      return c.charCodeAt(0) - "0".charCodeAt(0) >= 0 && c.charCodeAt(0) - "0".charCodeAt(0) <= 9;
    }
    getCurrentChar() {
      return this.source[this.current];
    }
    getCurrentAndAdvance() {
      const current = this.getCurrentChar();
      this.advance();
      return current;
    }
  };

  // index.ts
  var code = 'let woo = "hello" + " woo"; print woo;';
  var scanner = new Scanner(code);
  var tokens = scanner.scan();
  console.log(tokens);
  var parser = new Parser(tokens);
  var astList = parser.parse();
  var evaluator = new Eval();
  evaluator.run(astList);
})();
