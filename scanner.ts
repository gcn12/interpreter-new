import { Token } from "./token";

export class Scanner {
  tokens: Token[];
  source: string;
  start: number;
  current: number;
  keywords: Set<string>;

  constructor(source: string) {
    this.tokens = [];
    this.source = source;
    this.start = 0;
    this.current = 0;
    this.keywords = new Set(["let", "print"]);
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
        case "-": {
          this.tokens.push({ literal: "-", type: "minus" });
          this.advance();
          break;
        }
        case "*": {
          this.tokens.push({ literal: "*", type: "multiply" });
          this.advance();
          break;
        }
        case "/": {
          this.tokens.push({ literal: "/", type: "divide" });
          this.advance();
          break;
        }
        case "=": {
          this.tokens.push({ literal: "=", type: "equals" });
          this.advance();
          break;
        }
        case ";": {
          this.tokens.push({ literal: ";", type: "semicolon" });
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
            break;
          } else if (this.isAlpha()) {
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

  scanAlphaNumeric() {
    while (!this.isEOF() && (this.isAlpha() || this.isNumeric())) {
      this.advance();
    }

    return this.source.slice(this.start, this.current);
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

  isAlpha() {
    return (
      (this.getCurrentChar().charCodeAt(0) - "a".charCodeAt(0) >= 0 &&
        this.getCurrentChar().charCodeAt(0) - "z".charCodeAt(0) <= 25) ||
      (this.getCurrentChar().charCodeAt(0) - "A".charCodeAt(0) >= 0 &&
        this.getCurrentChar().charCodeAt(0) - "Z".charCodeAt(0) <= 25)
    );
  }

  isNumeric() {
    return (
      this.getCurrentChar().charCodeAt(0) - "0".charCodeAt(0) >= 0 &&
      this.getCurrentChar().charCodeAt(0) - "0".charCodeAt(0) <= 9
    );
  }

  getCurrentChar() {
    return this.source[this.current];
  }
}
