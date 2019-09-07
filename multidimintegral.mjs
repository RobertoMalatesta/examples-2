import { Array1D, Default, GaussianQuadMultidimIntegrator, M_PI, MultidimIntegral, TrapezoidIntegral } from '/ql.mjs';

class integrand {
    f(arg) {
        let sum = 1.;
        for (let i = 0; i < arg.length; i++) {
            sum *= Math.exp(-arg[i] * arg[i]) * Math.cos(arg[i]);
        }
        return sum;
    }
}

describe('multi-dim integral example', () => { 

    const dimension = 3;
    const exactSol = Math.pow(Math.exp(-.25) * Math.sqrt(M_PI), dimension);
    const f = new integrand();
    const intg = new GaussianQuadMultidimIntegrator(dimension, 15);
    const valueQuad = intg.f(f);
    const integrals = [];
    for (let i = 0; i < dimension; i++) {
        integrals.push(new TrapezoidIntegral(new Default(), 1.e-4, 20));
    }
    const a_limits = Array1D.fromSizeValue(integrals.length, -4.);
    const b_limits = Array1D.fromSizeValue(integrals.length, 4.);
    const testIntg = new MultidimIntegral(integrals);
    const valueGrid = testIntg.f(f, a_limits, b_limits);
    print(`Exact: ${exactSol}\n` +
        `Quad: ${valueQuad}\n` +
        `Grid: ${valueGrid}`);

});