import { AccountingEngine, Array1D, CallSpecifiedMultiProduct, CallSpecifiedPathwiseMultiProduct, collectNodeData, ExerciseAdapter, ExponentialForwardCorrelation, FlatVol, genericLongstaffSchwartzRegression, isInSubset, LogNormalFwdRateEuler, LogNormalFwdRatePc, LongstaffSchwartzExerciseStrategy, MarketModelPathwiseInverseFloater, MarketModelPathwiseSwap, moneyMarketMeasure, MTBrownianGeneratorFactory, MultiProductComposite, MultiStepInverseFloater, MultiStepNothing, MultiStepSwap, NothingExerciseValue, OrthogonalizedBumpFinder, PathwiseVegasOuterAccountingEngine, RiskStatistics, SequenceStatisticsInc, SobolBrownianGenerator, SobolBrownianGeneratorFactory, SwapBasisSystem, SwapForwardBasisSystem, SwapRateTrigger, UpperBoundEngine, VegaBumpCollection, VolatilityBumpInstrumentJacobian, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

function theVegaBumps(factorwiseBumping, marketModel, doCaps) {
    const multiplierCutOff = 50.0;
    const projectionTolerance = 1E-4;
    const numberRates = marketModel.numberOfRates();
    const caps = [];
    if (doCaps) {
        const capStrike = marketModel.initialRates()[0];
        for (let i = 0; i < numberRates - 1; i = i + 1) {
            const nextCap = new VolatilityBumpInstrumentJacobian.Cap();
            nextCap._startIndex = i;
            nextCap._endIndex = i + 1;
            nextCap._strike = capStrike;
            caps.push(nextCap);
        }
    }
    const swaptions = new Array(numberRates);
    for (let i = 0; i < numberRates; ++i) {
        swaptions[i]._startIndex = i;
        swaptions[i]._endIndex = numberRates;
    }
    const possibleBumps = new VegaBumpCollection().init1(marketModel, factorwiseBumping);
    const bumpFinder = new OrthogonalizedBumpFinder(possibleBumps, swaptions, caps, multiplierCutOff, projectionTolerance);
    const theBumps = [];
    bumpFinder.GetVegaBumps(theBumps);
    return theBumps;
}

function Bermudan() {
    const numberRates = 20;
    const accrual = 0.5;
    const firstTime = 0.5;
    const rateTimes = new Array(numberRates + 1);
    for (let i = 0; i < rateTimes.length; ++i) {
        rateTimes[i] = firstTime + i * accrual;
    }
    const paymentTimes = new Array(numberRates);
    const accruals = Array1D.fromSizeValue(numberRates, accrual);
    for (let i = 0; i < paymentTimes.length; ++i) {
        paymentTimes[i] = firstTime + (i + 1) * accrual;
    }
    const fixedRate = 0.05;
    const strikes = Array1D.fromSizeValue(numberRates, fixedRate);
    const receive = -1.0;
    const payerSwap = new MultiStepSwap(rateTimes, accruals, accruals, paymentTimes, fixedRate, true);
    const receiverSwap = new MultiStepSwap(rateTimes, accruals, accruals, paymentTimes, fixedRate, false);
    const exerciseTimes = Array.from(rateTimes);
    exerciseTimes.pop();
    const swapTriggers = Array1D.fromSizeValue(exerciseTimes.length, fixedRate);
    const naifStrategy = new SwapRateTrigger(rateTimes, swapTriggers, exerciseTimes);
    const collectedData = [];
    const basisCoefficients = [];
    const control = new NothingExerciseValue(rateTimes);
    const basisSystem = new SwapBasisSystem(rateTimes, exerciseTimes);
    const nullRebate = new NothingExerciseValue(rateTimes);
    const dummyProduct = new CallSpecifiedMultiProduct(receiverSwap, naifStrategy, new ExerciseAdapter(nullRebate));
    const evolution = dummyProduct.evolution();
    const seed = 12332;
    let trainingPaths = 65536;
    let paths = 16384;
    let vegaPaths = 16384 * 64;
    print(`training paths, ${trainingPaths} \n` +
        `paths, ${paths} \n` +
        `vega Paths, ${vegaPaths} \n`);
    trainingPaths = 512;
    paths = 1024;
    vegaPaths = 1024;
    const rateLevel = 0.05;
    const initialNumeraireValue = 0.95;
    const volLevel = 0.11;
    const beta = 0.2;
    const gamma = 1.0;
    const numberOfFactors = Math.min(5, numberRates);
    const displacementLevel = 0.02;
    const initialRates = Array1D.fromSizeValue(numberRates, rateLevel);
    const volatilities = Array1D.fromSizeValue(numberRates, volLevel);
    const displacements = Array1D.fromSizeValue(numberRates, displacementLevel);
    const correlations = new ExponentialForwardCorrelation(rateTimes, volLevel, beta, gamma);
    const calibration = new FlatVol(volatilities, correlations, evolution, numberOfFactors, initialRates, displacements);
    const marketModel = calibration;
    const generatorFactory = new SobolBrownianGeneratorFactory(SobolBrownianGenerator.Ordering.Diagonal, seed);
    const numeraires = moneyMarketMeasure(evolution);
    const evolver = new LogNormalFwdRatePc(marketModel, generatorFactory, numeraires);
    const evolverPtr = evolver;
    const t1 = Date.now();
    collectNodeData(evolver, receiverSwap, basisSystem, nullRebate, control, trainingPaths, collectedData);
    const t2 = Date.now();
    genericLongstaffSchwartzRegression(collectedData, basisCoefficients);
    const exerciseStrategy = new LongstaffSchwartzExerciseStrategy(basisSystem, basisCoefficients, evolution, numeraires, nullRebate, control);
    const bermudanProduct = new CallSpecifiedMultiProduct(new MultiStepNothing(evolution), exerciseStrategy, payerSwap);
    const callableProduct = new CallSpecifiedMultiProduct(receiverSwap, exerciseStrategy, new ExerciseAdapter(nullRebate));
    const allProducts = new MultiProductComposite();
    allProducts.add(payerSwap);
    allProducts.add(receiverSwap);
    allProducts.add(bermudanProduct);
    allProducts.add(callableProduct);
    allProducts.finalize();
    const accounter = new AccountingEngine(evolverPtr, allProducts, initialNumeraireValue);
    const stats = new SequenceStatisticsInc();
    accounter.multiplePathValues(stats, paths);
    const t3 = Date.now();
    const means = stats.mean();
    for (let i = 0; i < means.length; ++i) {
        print(`${means[i]}`);
    }
    print(`\ntime to build strategy,  ${(t2 - t1) / 1000} seconds\n`);
    print(`\ntime to price,  ${(t3 - t2) / 1000} seconds\n`);
    const pathsToDoVegas = vegaPaths;
    for (let i = 0; i < 4; ++i) {
        const allowFactorwiseBumping = i % 2 > 0;
        const doCaps = i / 2 > 0;
        const evolverEuler = new LogNormalFwdRateEuler(marketModel, generatorFactory, numeraires);
        const receiverPathwiseSwap = new MarketModelPathwiseSwap(rateTimes, accruals, strikes, receive);
        const receiverPathwiseSwapPtr = receiverPathwiseSwap.clone();
        const callableProductPathwise = new CallSpecifiedPathwiseMultiProduct(receiverPathwiseSwapPtr, exerciseStrategy);
        const callableProductPathwisePtr = callableProductPathwise.clone();
        const theBumps = theVegaBumps(allowFactorwiseBumping, marketModel, doCaps);
        const accountingEngineVegas = new PathwiseVegasOuterAccountingEngine(evolverEuler, callableProductPathwisePtr, marketModel, theBumps, initialNumeraireValue);
        const values = [], errors = [];
        accountingEngineVegas.multiplePathValues(values, errors, pathsToDoVegas);
        print('vega output \n' +
            ` factorwise bumping ${allowFactorwiseBumping} \n` +
            ` doCaps ${doCaps}`);
        let r = 0;
        print(` price estimate, ${values[r++]} `);
        for (let i = 0; i < numberRates; ++i, ++r) {
            print(` Delta, ${i}, ${values[r]}, ${errors[r]}`);
        }
        let totalVega = 0.0;
        for (; r < values.length; ++r) {
            print(` vega, ${r - 1 - numberRates}, ${values[r]}, ` +
                `${errors[r]}`);
            totalVega += values[r];
        }
        print(` total Vega, ${totalVega}`);
    }
    const doUpperBound = true;
    if (doUpperBound) {
        const uFactory = new MTBrownianGeneratorFactory(seed + 142);
        const upperEvolver = new LogNormalFwdRatePc(calibration, uFactory, numeraires);
        const innerEvolvers = [];
        const isExerciseTime = isInSubset(evolution.evolutionTimes(), exerciseStrategy.exerciseTimes());
        for (let s = 0; s < isExerciseTime.length; ++s) {
            if (isExerciseTime[s]) {
                const e = new LogNormalFwdRatePc(calibration, uFactory, numeraires, s);
                innerEvolvers.push(e);
            }
        }
        const uEngine = new UpperBoundEngine(upperEvolver, innerEvolvers, receiverSwap, nullRebate, receiverSwap, nullRebate, exerciseStrategy, initialNumeraireValue);
        const uStats = new RiskStatistics();
        const innerPaths = 255;
        const outerPaths = 256;
        const t4 = Date.now();
        uEngine.multiplePathValues(uStats, outerPaths, innerPaths);
        const upperBound = uStats.mean();
        const upperSE = uStats.errorEstimate();
        const t5 = Date.now();
        print(` Upper - lower is, ${upperBound}, with standard error ${upperSE}`);
        print(`\ntime to compute upper bound is,  ${(t5 - t4) / 1000} seconds\n`);
    }
    return 0;
}

function InverseFloater(rateLevel) {
    const numberRates = 20;
    const accrual = 0.5;
    const firstTime = 0.5;
    const strike = 0.15;
    const fixedMultiplier = 2.0;
    const floatingSpread = 0.0;
    const payer = true;
    const rateTimes = new Array(numberRates + 1);
    for (let i = 0; i < rateTimes.length; ++i) {
        rateTimes[i] = firstTime + i * accrual;
    }
    const paymentTimes = new Array(numberRates);
    const accruals = Array1D.fromSizeValue(numberRates, accrual);
    const fixedStrikes = Array1D.fromSizeValue(numberRates, strike);
    const floatingSpreads = Array1D.fromSizeValue(numberRates, floatingSpread);
    const fixedMultipliers = Array1D.fromSizeValue(numberRates, fixedMultiplier);
    for (let i = 0; i < paymentTimes.length; ++i) {
        paymentTimes[i] = firstTime + (i + 1) * accrual;
    }
    const inverseFloater = new MultiStepInverseFloater(rateTimes, accruals, accruals, fixedStrikes, fixedMultipliers, floatingSpreads, paymentTimes, payer);
    const exerciseTimes = Array.from(rateTimes);
    exerciseTimes.pop();
    const trigger = 0.05;
    const swapTriggers = Array1D.fromSizeValue(exerciseTimes.length, trigger);
    const naifStrategy = new SwapRateTrigger(rateTimes, swapTriggers, exerciseTimes);
    const collectedData = [];
    const basisCoefficients = [];
    const control = new NothingExerciseValue(rateTimes);
    const basisSystem = new SwapForwardBasisSystem(rateTimes, exerciseTimes);
    const nullRebate = new NothingExerciseValue(rateTimes);
    const dummyProduct = new CallSpecifiedMultiProduct(inverseFloater, naifStrategy, new ExerciseAdapter(nullRebate));
    const evolution = dummyProduct.evolution();
    const seed = 12332;
    let trainingPaths = 65536;
    let paths = 65536;
    let vegaPaths = 16384;
    trainingPaths = 8192;
    paths = 8192;
    vegaPaths = 1024;
    print(' inverse floater \n' +
        ` fixed strikes :  ${strike} \n` +
        ` number rates :  ${numberRates} \n` +
        `training paths, ${trainingPaths} \n` +
        `paths, ${paths} \n` +
        `vega Paths, ${vegaPaths}`);
    print(` rate level ${rateLevel}`);
    const initialNumeraireValue = 0.95;
    const volLevel = 0.11;
    const beta = 0.2;
    const gamma = 1.0;
    const numberOfFactors = Math.min(5, numberRates);
    const displacementLevel = 0.02;
    const initialRates = Array1D.fromSizeValue(numberRates, rateLevel);
    const volatilities = Array1D.fromSizeValue(numberRates, volLevel);
    const displacements = Array1D.fromSizeValue(numberRates, displacementLevel);
    const correlations = new ExponentialForwardCorrelation(rateTimes, volLevel, beta, gamma);
    const calibration = new FlatVol(volatilities, correlations, evolution, numberOfFactors, initialRates, displacements);
    const marketModel = calibration;
    const generatorFactory = new SobolBrownianGeneratorFactory(SobolBrownianGenerator.Ordering.Diagonal, seed);
    const numeraires = moneyMarketMeasure(evolution);
    const evolver = new LogNormalFwdRatePc(marketModel, generatorFactory, numeraires);
    const evolverPtr = evolver;
    const t1 = Date.now();
    collectNodeData(evolver, inverseFloater, basisSystem, nullRebate, control, trainingPaths, collectedData);
    const t2 = Date.now();
    genericLongstaffSchwartzRegression(collectedData, basisCoefficients);
    const exerciseStrategy = new LongstaffSchwartzExerciseStrategy(basisSystem, basisCoefficients, evolution, numeraires, nullRebate, control);
    const callableProduct = new CallSpecifiedMultiProduct(inverseFloater, exerciseStrategy, new ExerciseAdapter(nullRebate));
    const allProducts = new MultiProductComposite();
    allProducts.add(inverseFloater);
    allProducts.add(callableProduct);
    allProducts.finalize();
    const accounter = new AccountingEngine(evolverPtr, allProducts, initialNumeraireValue);
    const stats = new SequenceStatisticsInc();
    accounter.multiplePathValues(stats, paths);
    const t3 = Date.now();
    const means = stats.mean();
    for (let i = 0; i < means.length; ++i) {
        print(`${means[i]}`);
    }
    print(`\ntime to build strategy,  ${(t2 - t1) / 1000} seconds\n`);
    print(`\ntime to price,  ${(t3 - t2) / 1000} seconds\n`);
    const pathsToDoVegas = vegaPaths;
    for (let i = 0; i < 4; ++i) {
        const allowFactorwiseBumping = i % 2 > 0;
        const doCaps = i / 2 > 0;
        const evolverEuler = new LogNormalFwdRateEuler(marketModel, generatorFactory, numeraires);
        const pathwiseInverseFloater = new MarketModelPathwiseInverseFloater(rateTimes, accruals, accruals, fixedStrikes, fixedMultipliers, floatingSpreads, paymentTimes, payer);
        const pathwiseInverseFloaterPtr = pathwiseInverseFloater.clone();
        const callableProductPathwise = new CallSpecifiedPathwiseMultiProduct(pathwiseInverseFloaterPtr, exerciseStrategy);
        const callableProductPathwisePtr = callableProductPathwise.clone();
        const theBumps = theVegaBumps(allowFactorwiseBumping, marketModel, doCaps);
        const accountingEngineVegas = new PathwiseVegasOuterAccountingEngine(evolverEuler, callableProductPathwisePtr, marketModel, theBumps, initialNumeraireValue);
        const values = [], errors = [];
        accountingEngineVegas.multiplePathValues(values, errors, pathsToDoVegas);
        print('vega output \n' +
            ` factorwise bumping ${allowFactorwiseBumping}\n` +
            ` doCaps ${doCaps}`);
        let r = 0;
        print(` price estimate, ${values[r++]}`);
        for (let i = 0; i < numberRates; ++i, ++r) {
            print(` Delta, '${i}, ${values[r]}, ${errors[r]}`);
        }
        let totalVega = 0.0;
        for (; r < values.length; ++r) {
            print(` vega, ${r - 1 - numberRates}, ${values[r]} ,${errors[r]}`);
            totalVega += values[r];
        }
        print(` total Vega, ${totalVega}`);
    }
    const doUpperBound = true;
    if (doUpperBound) {
        const uFactory = new MTBrownianGeneratorFactory(seed + 142);
        const upperEvolver = new LogNormalFwdRatePc(calibration, uFactory, numeraires);
        const innerEvolvers = [];
        const isExerciseTime = isInSubset(evolution.evolutionTimes(), exerciseStrategy.exerciseTimes());
        for (let s = 0; s < isExerciseTime.length; ++s) {
            if (isExerciseTime[s]) {
                const e = new LogNormalFwdRatePc(calibration, uFactory, numeraires, s);
                innerEvolvers.push(e);
            }
        }
        const uEngine = new UpperBoundEngine(upperEvolver, innerEvolvers, inverseFloater, nullRebate, inverseFloater, nullRebate, exerciseStrategy, initialNumeraireValue);
        const uStats = new RiskStatistics();
        const innerPaths = 255;
        const outerPaths = 256;
        const t4 = Date.now();
        uEngine.multiplePathValues(uStats, outerPaths, innerPaths);
        const upperBound = uStats.mean();
        const upperSE = uStats.errorEstimate();
        const t5 = Date.now();
        print(` Upper - lower is, ${upperBound}, with standard error ${upperSE}`);
        print(`\ntime to compute upper bound is,  ${(t5 - t4) / 1000} seconds\n`);
    }
    return 0;
}

describe('market model example', () => {
    print(`${version}`);
    print('  ');
    
    Bermudan();
    for (let i = 5; i < 10; ++i) {
        InverseFloater(i / 100.0);
    }

});
