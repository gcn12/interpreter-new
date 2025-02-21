import { Eval } from "./eval";
import { Parser } from "./parser";
import { Scanner } from "./scanner";

const code = "5 + 100 + 1";

const scanner = new Scanner(code);
const tokens = scanner.scan();
const parser = new Parser(tokens);
const evaluator = new Eval(parser.parse());
console.log(evaluator.evaluate(parser.parse()));
