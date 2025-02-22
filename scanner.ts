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
            literal: this.scanString(),
          });
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
    while (!this.isEOF() && this.getCurrentChar() !== '"') {
      this.advance();
    }

    if (this.isEOF()) {
      throw new Error("Unterminated string");
    }

    this.advance();

    return this.source.slice(this.start + 1, this.current - 1);
  }

  scanAlphaNumeric() {
    while (
      !this.isEOF() &&
      (this.isAlpha(this.getCurrentChar()) ||
        this.isNumeric(this.getCurrentChar()))
    ) {
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

  isAlpha(c: string) {
    return (
      (c.charCodeAt(0) - "a".charCodeAt(0) >= 0 &&
        c.charCodeAt(0) - "z".charCodeAt(0) <= 25) ||
      (c.charCodeAt(0) - "A".charCodeAt(0) >= 0 &&
        c.charCodeAt(0) - "Z".charCodeAt(0) <= 25)
    );
  }

  isNumeric(c: string) {
    return (
      c.charCodeAt(0) - "0".charCodeAt(0) >= 0 &&
      c.charCodeAt(0) - "0".charCodeAt(0) <= 9
    );
  }

  getCurrentChar() {
    return this.source[this.current];
  }

  getCurrentAndAdvance() {
    const current = this.getCurrentChar();
    this.advance();
    return current;
  }
}
