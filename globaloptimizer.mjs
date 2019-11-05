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
import { Array1D, Constraint, CostFunction, DifferentialEvolution, EndCriteria, ExponentialIntensity, FireflyAlgorithm, GaussianSimulatedAnnealing, HybridSimulatedAnnealing, KNeighbors, LevenbergMarquardt, LevyFlightInertia, LevyFlightWalk, M_E, M_TWOPI, MersenneTwisterUniformRng, NonhomogeneousBoundaryConstraint, ParticleSwarmOptimization, ProbabilityBoltzmannDownhill, Problem, ReannealingTrivial, SamplerGaussian, SimulatedAnnealing, TemperatureExponential, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';
const seed = 127;

function ackley(x) {
    let p1 = 0.0, p2 = 0.0;
    for (let i = 0; i < x.length; i++) {
        p1 += x[i] * x[i];
        p2 += Math.cos(M_TWOPI * x[i]);
    }
    p1 = -0.2 * Math.sqrt(0.5 * p1);
    p2 *= 0.5;
    return M_E + 20.0 - 20.0 * Math.exp(p1) - Math.exp(p2);
}

function ackleyValues(x) {
    const y = new Array(x.length);
    for (let i = 0; i < x.length; i++) {
        let p1 = x[i] * x[i];
        p1 = -0.2 * Math.sqrt(0.5 * p1);
        const p2 = 0.5 * Math.cos(M_TWOPI * x[i]);
        y[i] = M_E + 20.0 - 20.0 * Math.exp(p1) - Math.exp(p2);
    }
    return y;
}

function rosenbrock(x) {
    if (x.length <= 1) {
        throw new Error('Input size needs to be higher than 1');
    }
    let result = 0.0;
    for (let i = 0; i < x.length - 1; i++) {
        const temp = (x[i + 1] - x[i] * x[i]);
        result += (x[i] - 1.0) * (x[i] - 1.0) + 100.0 * temp * temp;
    }
    return result;
}

function eggholder(x) {
    if (x.length !== 2) {
        throw new Error('Input size needs to be equal to 2');
    }
    const p = (x[1] + 47.0);
    return -p * Math.sin(Math.sqrt(Math.abs(0.5 * x[0] + p))) -
        x[0] * Math.sin(Math.sqrt(Math.abs(x[0] - p)));
}

function printFunction(p, x) {
    print(` f(' ${x[0]}`);
    for (let i = 1; i < x.length; i++) {
        print(`, ${x[i]}`);
    }
    const val = p.value(x);
    print(`) = ${val}`);
    return val;
}

class TestFunction extends CostFunction {
    constructor(f, fs = null) {
        super();
        this._f = f;
        this._fs = fs;
    }
    value(x) {
        return this._f.f(x);
    }
    values(x) {
        if (this._fs == null) {
            throw new Error('Invalid function');
        }
        return this._fs.f(x);
    }
}

function test(method, f, endCriteria, start, constraint = new Constraint(), optimum = []) {
    if (start.length <= 0) {
        throw new Error('Input size needs to be at least 1');
    }
    print('Starting point: ');
    let c = new Constraint();
    if (!constraint.empty()) {
        c = constraint;
    }
    const p = new Problem(f, c, start);
    printFunction(p, start);
    method.minimize(p, endCriteria);
    print('End point: ');
    const val = printFunction(p, p.currentValue());
    if (optimum.length > 0) {
        print('Global optimium: ');
        const optimVal = printFunction(p, optimum);
        if (Math.abs(optimVal) < 1e-13) {
            return Math.abs(val - optimVal) < 1e-6;
        }
        else {
            return Math.abs((val - optimVal) / optimVal) < 1e-6;
        }
    }
    return true;
}

function testFirefly() {
    const n = 2;
    const constraint = new NonhomogeneousBoundaryConstraint(Array1D.fromSizeValue(n, -512.0), Array(n, 512.0));
    const x = Array1D.fromSizeValue(n, 0.0);
    const optimum = new Array(n);
    optimum[0] = 512.0;
    optimum[1] = 404.2319;
    const agents = 150;
    const vola = 1.5;
    const intense = 1.0;
    const intensity = new ExponentialIntensity(10.0, 1e-8, intense);
    const randomWalk = new LevyFlightWalk(vola, 0.5, 1.0, seed);
    print(`Function eggholder, Agents: ${agents}', Vola: ${vola}` +
        `, Intensity: ${intense}`);
    const f = new TestFunction({
        f: x => {
            return eggholder(x);
        }
    });
    const fa = new FireflyAlgorithm(agents, intensity, randomWalk, 40);
    const ec = new EndCriteria(5000, 1000, 1.0e-8, 1.0e-8, 1.0e-8);
    test(fa, f, ec, x, constraint, optimum);
    print('================================================================');
}

function testSimulatedAnnealing(dimension, maxSteps, staticSteps) {
    const f = new TestFunction({
        f: x => {
            return ackley(x);
        }
    }, {
        f: x => {
            return ackleyValues(x);
        }
    });
    const x = Array1D.fromSizeValue(dimension, 1.5);
    const optimum = Array1D.fromSizeValue(dimension, 0.0);
    const lower = Array1D.fromSizeValue(dimension, -5.0);
    const upper = Array1D.fromSizeValue(dimension, 5.0);
    const constraint = new NonhomogeneousBoundaryConstraint(lower, upper);
    const lambda = 0.1;
    const temperature = 350;
    const epsilon = 0.99;
    const ms = 1000;
    print(`Function ackley, Lambda: ${lambda}` +
        `, Temperature: ${temperature}', Epsilon: ${epsilon}` +
        `, Iterations: ${ms}`);
    const rng = new MersenneTwisterUniformRng().init1(seed);
    const sa = new SimulatedAnnealing(new MersenneTwisterUniformRng())
        .init1(lambda, temperature, epsilon, ms, rng);
    const ec = new EndCriteria(maxSteps, staticSteps, 1.0e-8, 1.0e-8, 1.0e-8);
    test(sa, f, ec, x, constraint, optimum);
    print('================================================================');
}

function testGaussianSA(dimension, maxSteps, staticSteps, initialTemp, finalTemp, resetScheme = HybridSimulatedAnnealing.ResetScheme.ResetToBestPoint, resetSteps = 150, optimizeScheme = HybridSimulatedAnnealing.LocalOptimizeScheme.EveryBestPoint, localOptimizer = new LevenbergMarquardt()) {
    const f = new TestFunction({
        f: x => {
            return ackley(x);
        }
    }, {
        f: x => {
            return ackleyValues(x);
        }
    });
    print(`Function: ackley, Dimensions: ${dimension}` +
        `, Initial temp: ${initialTemp}, Final temp: ${finalTemp}` +
        `, Reset scheme: ${resetScheme}` +
        `, Reset steps: ${resetSteps}`);
    const x = Array1D.fromSizeValue(dimension, 1.5);
    const optimum = Array1D.fromSizeValue(dimension, 0.0);
    const lower = Array1D.fromSizeValue(dimension, -5.0);
    const upper = Array1D.fromSizeValue(dimension, 5.0);
    const constraint = new NonhomogeneousBoundaryConstraint(lower, upper);
    const sampler = new SamplerGaussian(seed);
    const probability = new ProbabilityBoltzmannDownhill(seed);
    const temperature = new TemperatureExponential().init(initialTemp, dimension);
    const sa = new GaussianSimulatedAnnealing(sampler, probability, temperature, new ReannealingTrivial(), initialTemp, finalTemp, 50, resetScheme, resetSteps, localOptimizer, optimizeScheme);
    const ec = new EndCriteria(maxSteps, staticSteps, 1.0e-8, 1.0e-8, 1.0e-8);
    test(sa, f, ec, x, constraint, optimum);
    print('================================================================');
}

function testPSO(n) {
    const constraint = new NonhomogeneousBoundaryConstraint(Array1D.fromSizeValue(n, -1.0), Array1D.fromSizeValue(n, 4.0));
    const x = Array1D.fromSizeValue(n, 0.0);
    const optimum = Array1D.fromSizeValue(n, 1.0);
    const agents = 100;
    const kneighbor = 25;
    const threshold = 500;
    print(`Function: rosenbrock, Dimensions: ${n}` +
        `, Agents: ${agents}, K-neighbors: ${kneighbor}` +
        `, Threshold: ${threshold}`);
    const topology = new KNeighbors(kneighbor);
    const inertia = new LevyFlightInertia(1.5, threshold, seed);
    const f = new TestFunction({
        f: x => {
            return rosenbrock(x);
        }
    });
    const pso = new ParticleSwarmOptimization().init1(agents, topology, inertia, 2.05, 2.05, seed);
    const ec = new EndCriteria(10000, 1000, 1.0e-8, 1.0e-8, 1.0e-8);
    test(pso, f, ec, x, constraint, optimum);
    print('================================================================');
}

function testDifferentialEvolution(n, agents) {
    const constraint = new NonhomogeneousBoundaryConstraint(Array1D.fromSizeValue(n, -4.0), Array1D.fromSizeValue(n, 4.0));
    const x = Array1D.fromSizeValue(n, 0.0);
    const optimum = Array1D.fromSizeValue(n, 1.0);
    const f = new TestFunction({
        f: x => {
            return rosenbrock(x);
        }
    });
    const probability = 0.3;
    const stepsizeWeight = 0.6;
    const strategy = DifferentialEvolution.Strategy.BestMemberWithJitter;
    print(`Function: rosenbrock, Dimensions: ${n}` +
        `, Agents: ${agents}, Probability: ${probability}` +
        `, StepsizeWeight: ${stepsizeWeight}` +
        ', Strategy: BestMemberWithJitter');
    const config = new DifferentialEvolution.Configuration();
    config.withBounds(true)
        .withCrossoverProbability(probability)
        .withPopulationMembers(agents)
        .withStepsizeWeight(stepsizeWeight)
        .withStrategy(strategy)
        .withSeed(seed);
    const de = new DifferentialEvolution(config);
    const ec = new EndCriteria(5000, 1000, 1.0e-8, 1.0e-8, 1.0e-8);
    test(de, f, ec, x, constraint, optimum);
    print('================================================================');
}

describe(`global optimizer example ${version}`, () => {
    
    print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    print('Firefly Algorithm Test');
    print('----------------------------------------------------------------');
    let t1 = Date.now();
    testFirefly();
    let t2 = Date.now();
    print(`\nthis step took ${(t2 - t1) / 1000} seconds\n`);
    print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    print('Hybrid Simulated Annealing Test');
    print('----------------------------------------------------------------');
    t1 = Date.now();
    testGaussianSA(3, 500, 200, 100.0, 0.1, HybridSimulatedAnnealing.ResetScheme.ResetToBestPoint, 150, HybridSimulatedAnnealing.LocalOptimizeScheme.EveryNewPoint);
    testGaussianSA(10, 500, 200, 100.0, 0.1, HybridSimulatedAnnealing.ResetScheme.ResetToBestPoint, 150, HybridSimulatedAnnealing.LocalOptimizeScheme.EveryNewPoint);
    testGaussianSA(30, 500, 200, 100.0, 0.1, HybridSimulatedAnnealing.ResetScheme.ResetToBestPoint, 150, HybridSimulatedAnnealing.LocalOptimizeScheme.EveryNewPoint);
    t2 = Date.now();
    print(`\nthis step took ${(t2 - t1) / 1000} seconds\n`);
    print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    print('Particle Swarm Optimization Test');
    print('----------------------------------------------------------------');
    t1 = Date.now();
    testPSO(3);
    testPSO(10);
    testPSO(30);
    t2 = Date.now();
    print(`\nthis step took ${(t2 - t1) / 1000} seconds\n`);
    print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    print('Simulated Annealing Test');
    print('----------------------------------------------------------------');
    t1 = Date.now();
    testSimulatedAnnealing(3, 10000, 4000);
    testSimulatedAnnealing(10, 10000, 4000);
    testSimulatedAnnealing(30, 10000, 4000);
    t2 = Date.now();
    print(`\nthis step took ${(t2 - t1) / 1000} seconds\n`);
    print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    print('Differential Evolution Test');
    print('----------------------------------------------------------------');
    t1 = Date.now();
    testDifferentialEvolution(3, 50);
    testDifferentialEvolution(10, 150);
    testDifferentialEvolution(30, 450);
    t2 = Date.now();
    print(`\nthis step took ${(t2 - t1) / 1000} seconds\n`);

});
