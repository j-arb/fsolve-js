# nr-solver
**Newton - Raphson numerical solver for n-dimensions written in TypeScript.**<br>

## Autor
j-arb

## Licencia
This project is governed by the "GNU General Public License". You can find a copy of the license in the [LICENCE](/LICENSE) file of this repository.

## Example usage
<pre>
import { Matrix, matrix, zeros } from "mathjs";
import { Differentiator } from "./differentiator";
import { Solver } from "./solver";

let slvr = new Solver(1e-3, 1e10, Infinity, 1e-6);
let diff = new Differentiator();
let x0 = matrix([[20], [-2]]);
let f = (x: Matrix) => matrix([
    [Math.pow(x.get([0, 0]), 2) + Math.pow(x.get([1, 0]), 2) - 10],
    [Math.cos(x.get([0,0])) - x.get([1,0])]
]);

console.log(slvr.solve(f, x0));
</pre>