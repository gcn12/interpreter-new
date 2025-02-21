import { Token } from "./token";
import { tokens } from "./tokens";

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
    return (
      this.getCurrentChar().charCodeAt(0) - "0".charCodeAt(0) >= 0 &&
      this.getCurrentChar().charCodeAt(0) - "0".charCodeAt(0) <= 9
    );
  }

  getCurrentChar() {
    return this.source[this.current];
  }
}
