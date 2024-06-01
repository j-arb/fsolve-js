import { Matrix, add, matrix, transpose, zeros } from "mathjs";

/**
 * Differentiator class
 * Implements the numerical calculation of a jacobian
 */
export class Differentiator {
    /**
     * Delta variation to calculate derivatives numerically
     */
    private delta: number;

    /**
     * Jacobian class constructor
     * @param delta Delta variation to calculate derivatives numerically
     */
    constructor(delta: number = 1e-9) {
        this.delta = delta;
    }

    /**
     * Calculates numerical jacobian of f (vector) evaluated at x (vector)
     * @param f function vector
     * @param x point vector (n x 1) mathjs matrix
     * 
     * @returns jacobian matrix.
     */
    jacobian(f: (x: Matrix) => Matrix, x: Matrix): Matrix {
        const n = x.size()[0];
        const J = matrix(zeros([n, n]));
        
        for(let i = 0; i < n; i++) {
            const newRow = transpose(this.gradient((x) => f(x).get([i, 0]) , x));
            this.replaceRow(J, newRow, i);
        }

        return J;
    }

    /**
     * Numerically calculates the gradient of f evaluated at x.
     */
    gradient(f: (x: Matrix) => number, x: Matrix): Matrix {
        const n = x.size()[0];
        const dx = matrix(zeros([n,1]));

        for(let j = 0; j < n; j++) {
            dx.set([j,0], this.partialDiff(f, j, x))
        }

        return dx;
    }

    /**
     * Numerically calculates the jth partial derivative at x
     */
    partialDiff(f: (x: Matrix) => number, j: number, x: Matrix): number {
        const n = x.size()[0];
        const del0 = matrix(zeros([n, 1])).set([j, 0], -this.delta);
        const del1 = matrix(zeros([n, 1])).set([j, 0], +this.delta);
        const x0 = add(x, del0);
        const x1 = add(x, del1);
        const y0 = f(x0);
        const y1 = f(x1);
        const diff = (y1 - y0) / (2*this.delta);
        return diff;
    }

    private replaceRow(matrix: Matrix, newRow: Matrix, j: number) {
        const n = matrix.size()[1];

        for(let i = 0; i < n; i++) {
            matrix.set([j, i], newRow.get([0, i]));
        }
    }
}