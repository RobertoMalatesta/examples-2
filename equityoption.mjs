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
import { Actual365Fixed, AdditiveEQPBinomialTree, AmericanExercise, AnalyticEuropeanEngine, AnalyticHestonEngine, BaroneAdesiWhaleyApproximationEngine, BatesEngine, BatesModel, BatesProcess, BermudanExercise, BinomialVanillaEngine, BjerksundStenslandApproximationEngine, BlackConstantVol, BlackScholesMertonProcess, CoxRossRubinstein, CrankNicolson, DateExt, EuropeanExercise, FDAmericanEngine, FDBermudanEngine, FDEuropeanEngine, FlatForward, Handle, HestonModel, HestonProcess, IntegralEngine, JarrowRudd, Joshi4, LeisenReimer, LowDiscrepancy, MakeMCAmericanEngine, MakeMCEuropeanEngine, Option, PlainVanillaPayoff, PseudoRandom, Settings, SimpleQuote, TARGET, Tian, TimeUnit, Trigeorgis, VanillaOption, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

describe(`equity option example ${version}`, () => { 
    
    const calendar = new TARGET();
    const todaysDate = new Date('15-May-1998');
    const settlementDate = new Date('17-May-1998');
    Settings.evaluationDate.set(todaysDate);
    const type = Option.Type.Put;
    const underlying = 36;
    const strike = 40;
    const dividendYield = 0.00;
    const riskFreeRate = 0.06;
    const volatility = 0.20;
    const maturity = new Date('17-May-1999');
    const dayCounter = new Actual365Fixed();
    print(`Option type = ${type} \n` +
        `Maturity = ${maturity} \n` +
        `Underlying price = ${underlying}\n` +
        `Strike = ${strike}\n` +
        `Risk-free interest rate = ${riskFreeRate}\n` +
        `Dividend yield = ${dividendYield} \n` +
        `Volatility = ${volatility}`);
    const exerciseDates = [];
    for (let i = 1; i <= 4; i++) {
        exerciseDates.push(DateExt.advance(settlementDate, 3 * i, TimeUnit.Months));
    }
    const europeanExercise = new EuropeanExercise(maturity);
    const bermudanExercise = new BermudanExercise(exerciseDates);
    const americanExercise = new AmericanExercise().init1(settlementDate, maturity);
    const underlyingH = new Handle(new SimpleQuote(underlying));
    const flatTermStructure = new Handle(new FlatForward().ffInit2(settlementDate, riskFreeRate, dayCounter));
    const flatDividendTS = new Handle(new FlatForward().ffInit2(settlementDate, dividendYield, dayCounter));
    const flatVolTS = new Handle(new BlackConstantVol().bcvInit1(settlementDate, calendar, volatility, dayCounter));
    const payoff = new PlainVanillaPayoff(type, strike);
    const bsmProcess = new BlackScholesMertonProcess(underlyingH, flatDividendTS, flatTermStructure, flatVolTS);
    const europeanOption = new VanillaOption(payoff, europeanExercise);
    const bermudanOption = new VanillaOption(payoff, bermudanExercise);
    const americanOption = new VanillaOption(payoff, americanExercise);
    europeanOption.setPricingEngine(new AnalyticEuropeanEngine().init1(bsmProcess));
    print(`Black-Scholes ${europeanOption.NPV()}`);
    const hestonProcess = new HestonProcess(flatTermStructure, flatDividendTS, underlyingH, volatility * volatility, 1.0, volatility * volatility, 0.001, 0.0);
    const hestonModel = new HestonModel(hestonProcess);
    europeanOption.setPricingEngine(new AnalyticHestonEngine().aheInit2(hestonModel));
    print(`Heston semi-analytic ${europeanOption.NPV()}`);
    const batesProcess = new BatesProcess(flatTermStructure, flatDividendTS, underlyingH, volatility * volatility, 1.0, volatility * volatility, 0.001, 0.0, 1e-14, 1e-14, 1e-14);
    const batesModel = new BatesModel(batesProcess);
    europeanOption.setPricingEngine(new BatesEngine().beInit1(batesModel));
    print(`Bates semi-analytic ${europeanOption.NPV()}`);
    americanOption.setPricingEngine(new BaroneAdesiWhaleyApproximationEngine(bsmProcess));
    print(`Barone-Adesi/Whaley ${americanOption.NPV()}`);
    americanOption.setPricingEngine(new BjerksundStenslandApproximationEngine(bsmProcess));
    print(`Bjerksund/Stensland ${americanOption.NPV()}`);
    europeanOption.setPricingEngine(new IntegralEngine(bsmProcess));
    print(`Integral ${europeanOption.NPV()}`);
    let timeSteps = 801;
    europeanOption.setPricingEngine(new FDEuropeanEngine(new CrankNicolson())
        .init1(bsmProcess, timeSteps, timeSteps - 1));
    bermudanOption.setPricingEngine(new FDBermudanEngine(new CrankNicolson())
        .init1(bsmProcess, timeSteps, timeSteps - 1));
    americanOption.setPricingEngine(new FDAmericanEngine(new CrankNicolson())
        .inprint(bsmProcess, timeSteps, timeSteps - 1));
    print(`Finite differences ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`);
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new JarrowRudd())
        .bveInprint(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new JarrowRudd())
        .bveInprint(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new JarrowRudd())
        .bveInprint(bsmProcess, timeSteps));
    print(`Binomial Jarrow-Rudd ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`);
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new CoxRossRubinstein())
        .bveInprint(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new CoxRossRubinstein())
        .bveInprint(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new CoxRossRubinstein())
        .bveInprint(bsmProcess, timeSteps));
    print(`Binomial Cox-Ross-Rubinstein ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`);
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new AdditiveEQPBinomialTree())
        .bveInprint(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new AdditiveEQPBinomialTree())
        .bveInprint(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new AdditiveEQPBinomialTree())
        .bveInprint(bsmProcess, timeSteps));
    print(`Additive equiprobabilities ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`);
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new Trigeorgis())
        .bveInprint(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new Trigeorgis())
        .bveInprint(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new Trigeorgis())
        .bveInprint(bsmProcess, timeSteps));
    print(`Binomial Trigeorgis ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`);
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new Tian()).bveInprint(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new Tian()).bveInprint(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new Tian()).bveInprint(bsmProcess, timeSteps));
    print(`Binomial Tian ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`);
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new LeisenReimer())
        .bveInprint(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new LeisenReimer())
        .bveInprint(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new LeisenReimer())
        .bveInprint(bsmProcess, timeSteps));
    print(`Binomial Leisen-Reimer ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`);
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new Joshi4()).bveInprint(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new Joshi4()).bveInprint(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new Joshi4()).bveInprint(bsmProcess, timeSteps));
    print(`Binomial Joshi ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`);
    timeSteps = 1;
    const mcSeed = 42;
    const mcengine1 = new MakeMCEuropeanEngine(new PseudoRandom())
        .mmceeInprint(bsmProcess)
        .withSteps(timeSteps)
        .withAbsoluteTolerance(0.02)
        .withSeed(mcSeed)
        .f();
    europeanOption.setPricingEngine(mcengine1);
    print(`MC (crude) ${europeanOption.NPV()}`);
    const nSamples = 32768;
    const mcengine2 = new MakeMCEuropeanEngine(new LowDiscrepancy())
        .mmceeInprint(bsmProcess)
        .withSteps(timeSteps)
        .withSamples(nSamples)
        .f();
    europeanOption.setPricingEngine(mcengine2);
    print(`QMC (Sobol) ${europeanOption.NPV()}`);
    const mcengine3 = new MakeMCAmericanEngine(new PseudoRandom())
        .mmcaeInprint(bsmProcess)
        .withSteps(100)
        .withAntitheticVariate()
        .withCalibrationSamples(4096)
        .withAbsoluteTolerance(0.02)
        .withSeed(mcSeed)
        .f();
    americanOption.setPricingEngine(mcengine3);
    print(`MC (Longstaff Schwartz) ${americanOption.NPV()}`);

});