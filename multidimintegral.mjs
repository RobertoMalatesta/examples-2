/**
 * Copyright 2019 Jin Yang. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { Array1D, Default, GaussianQuadMultidimIntegrator, M_PI, MultidimIntegral, TrapezoidIntegral, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

class integrand {
    f(arg) {
        let sum = 1.;
        for (let i = 0; i < arg.length; i++) {
            sum *= Math.exp(-arg[i] * arg[i]) * Math.cos(arg[i]);
        }
        return sum;
    }
}

describe(`multi-dim integral example ${version}`, () => { 
    
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