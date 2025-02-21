export class Scanner {
  tokens: string[];
  source: string;
  start: number;
  current: number;

  constructor(source: string) {
    this.tokens = [];
    this.source = source;
    this.start = 0;
    this.current = 0;
  }

  scan() {}
}
