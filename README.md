# fsolve-js
**A numerical solver for non-linear systems of equations, utilizing the n-dimensional Newton-Raphson method.**<br>

## Instalation
```sh
npm install fsolve-js
```

## Getting Started
Here is a simple example to help you get started with `fsolve-js`:
```ts
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
```

## Autor
Juan Esteban Arboleda Restrepo<br>
Github: [j-arb](https://github.com/j-arb)
Email: [juanesteban.arboledagc@gmail.com](mailto:juanesteban.arboledagc@gmail.com)

## License
```
Copyright (C) Juan Arboleda <juanesteban.arboledagc@gmail.com>

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
```