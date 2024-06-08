import { Differentiator } from "./differentiator.js";
import { multiply, add, Matrix, max, inv, abs, pinv } from "mathjs";

/**
 * Solver class
 * Represents an intance of the numeric
 * n-dimensional newton - raphson solver
 */
export class Solver {
    /**
     * Minimum error to stop solver
     */
    private stopError: number;

    /**
     * Maximum number of iterations to stop solver
     */
    private maxIterations: number;

    /**
     * Solver timeout (in ms)
     */
    private timeOut: number;

    /**
     * Numerical differentiation delta
     */
    private delta: number;

    private diff: Differentiator;

    /**
     * Solver constructor
     * @param stopError - Minimum error to stop solver.
     * @param maxIterations - Maximum number of iterations to stop solver.
     * @param timeOut - Solver timeout (in ms)
     * @param delta Numerical differentiation delta.
     */
    constructor(stopError: number = 1e-6, maxIterations: number = 1e3, timeOut: number = 3.6e6, delta: number = 1e-9) {
        this.stopError = stopError;
        this.maxIterations = maxIterations;
        this.timeOut = timeOut;
        this.delta = delta;
        this.diff = new Differentiator(delta);
    }

    /**
     * Numerically finds the zeros of function f using Newton -
     * Raphson method.
     * @param f function to solve
     * @param x0 initial guess
     * @returns {Solution} use Solution.solved() to check
     * if the solver found a solution, Solution.message() to
     * get solver message and Solution.getX() to get solution's
     * X vector.
     */
    solve(f: (x: Matrix) => Matrix, x0: Matrix): Solution {
        const n = x0.size()[0];

        let error = Infinity;
        let iter = 0;
        const initialTime = Date.now();

        while (error >= this.stopError) {
            if(iter >= this.maxIterations) {
                return Solution.maxIterReached(x0);
            } else if((Date.now() - initialTime) >= this.timeOut) {
                return Solution.timeOut(x0);
            }

            const y0 = f(x0);
            const J = this.diff.jacobian(f, x0);
            const b = multiply(y0, -1);
            const invJ = inv(J);
            const h = multiply(invJ, b);
            x0 = add(x0, h);
            error = max(abs(f(x0))) as number;
            iter += 1;
        }

        return Solution.success(x0);
    }

    /**
     * Numerically finds the zeros of function f using Newton -
     * Raphson method generalization for underdetermined systems.
     * @param f function to solve
     * @param x0 initial guess
     * @returns {Solution} use Solution.solved() to check
     * if the solver found a solution, Solution.message() to
     * get solver message and Solution.getX() to get solution's
     * X vector.
     */
    solveUnderdetermined(f: (x: Matrix) => Matrix, x0: Matrix): Solution {
        const n = x0.size()[0];
        const m = f(x0).size()[0];
        if(m > n) {
            throw new Error("System has more equations than variables.");
        }
        if(m === n) {
            console.warn("Using solveUnderdetermined() for system with same number of variables " + 
                "and equations. Use solve() for better performance."
            );
        }

        let error = Infinity;
        let iter = 0;
        const initialTime = Date.now();

        while (error >= this.stopError) {
            if(iter >= this.maxIterations) {
                return Solution.maxIterReached(x0);
            } else if((Date.now() - initialTime) >= this.timeOut) {
                return Solution.timeOut(x0);
            }

            const y0 = f(x0);
            const J = this.diff.jacobian(f, x0);
            const b = multiply(y0, -1);
            const invJ = pinv(J);
            const h = multiply(invJ, b);
            x0 = add(x0, h);
            error = max(abs(f(x0))) as number;
            iter += 1;
        }

        return Solution.success(x0);
    }
}

/**
 * Represents a solution
 */
class Solution {
    private x: Matrix;
    private _solved: boolean;
    private msg: String;

    constructor(x: Matrix, solved: boolean, msg: String) {
        this.x = x;
        this._solved = solved;
        this.msg = msg;
    }

    /**
     * Get solution's X Vector.
     */
    getX(): Matrix {
        return this.x;
    }

    /**
     * @returns boolean indicating if the solver found a solution 
     */
    solved(): boolean {
        return this._solved;
    }

    /**
     * @returns solver's message.
     */
    message(): String {
        return this.msg;
    }

    static success(x: Matrix): Solution {
        return new Solution(x, true, "Solution achived");
    }

    static timeOut(x: Matrix) {
        return new Solution(x, false, "No solution found. Solver timed out");
    }

    static maxIterReached(x: Matrix) {
        return new Solution(x, false, "No solution found. Max number of iteratios reached");
    }
}