import { Eval } from "./eval";
import { Parser } from "./parser";
import { Scanner } from "./scanner";

// const code = "51 + 10 * 1 - 61";
// const code = "100 / 10 + 10000";
const code = "let hello = 5; print hello; print 5 + 10000 / 2;";

const scanner = new Scanner(code);
const tokens = scanner.scan();
const parser = new Parser(tokens);
const astList = parser.parse();

const evaluator = new Eval();

evaluator.run(astList);
// console.log(evaluator.run(astList));
