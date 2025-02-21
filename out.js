(() => {
  // eval.ts
  var Eval = class {
    root;
    constructor(root) {
      this.root = root;
    }
    evaluate(node) {
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
  };

  // parser.ts
  var Parser = class {
    tokens;
    constructor(tokens3) {
      this.tokens = tokens3;
    }
    parse() {
      const token = this.tokens[0];
      return {
        left: { value: 1e3, type: "int" },
        right: { value: 1, type: "int" },
        operator: "+",
        type: "binary"
      };
    }
  };

  // tokens.ts
  var tokens = /* @__PURE__ */ new Set(["let", "+"]);

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
      this.keywords = tokens;
    }
    scan() {
      while (!this.isEOF()) {
        this.start = this.current;
        const c = this.getCurrentChar();
        switch (c) {
          case "+": {
            this.tokens.push({ literal: "+", type: "plus" });
            this.advance();
            break;
          }
          case " ": {
            this.advance();
            break;
          }
          default: {
            if (this.isNumeric()) {
              this.tokens.push({ literal: Number(this.scanInt()), type: "int" });
            }
          }
        }
      }
      return this.tokens;
    }
    scanInt() {
      while (!this.isEOF() && this.isNumeric()) {
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
    isNumeric() {
      return this.getCurrentChar().charCodeAt(0) - "0".charCodeAt(0) >= 0 && this.getCurrentChar().charCodeAt(0) - "0".charCodeAt(0) <= 9;
    }
    getCurrentChar() {
      return this.source[this.current];
    }
  };

  // index.ts
  var code = "5 + 100 + 1";
  var scanner = new Scanner(code);
  var tokens2 = scanner.scan();
  var parser = new Parser(tokens2);
  var evaluator = new Eval(parser.parse());
  console.log(evaluator.evaluate(parser.parse()));
})();
