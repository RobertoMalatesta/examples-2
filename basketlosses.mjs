import { Actual365Fixed, Array1D, Array2D, BaseCorrelationLossModel, BaseCorrelationTermStructure, Basket, BinomialLossModel, BusinessDayConvention, ConstantLossLatentmodel, EURCurrency, FlatHazardRate, GaussianLHPLossModel, Handle, InhomogeneousPoolLossModel, Issuer, LatentModelIntegrationType, NorthAmericaCorpDefaultKey, Period, Pool, RandomDefaultLM, RandomLossLM, Seniority, Settings, SimpleQuote, SpotRecoveryLatentModel, TARGET, TCopulaPolicy, TimeUnit, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

describe('basket losses example', () => { 
    print(`${version}`);
    print('  ');

    const calendar = new TARGET();
    let todaysDate = new Date('19-March-2014');
    todaysDate = calendar.adjust(todaysDate);
    Settings.evaluationDate.set(todaysDate);
    const hazardRates = [
        0.001, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09
    ];
    const names = [];
    for (let i = 0; i < hazardRates.length; i++) {
        names.push(`Acme${i}`);
    }
    const defTS = [];
    for (let i = 0; i < hazardRates.length; i++) {
        defTS.push(new Handle(new FlatHazardRate().fhrInit4(0, new TARGET(), hazardRates[i], new Actual365Fixed())));
        defTS[defTS.length - 1].currentLink().enableExtrapolation();
    }
    const issuers = [];
    for (let i = 0; i < hazardRates.length; i++) {
        const curves = [[
                new NorthAmericaCorpDefaultKey(new EURCurrency(), Seniority.SeniorSec, new Period(), 1.),
                defTS[i]
            ]];
        issuers.push(new Issuer().init1(curves));
    }
    const thePool = new Pool();
    for (let i = 0; i < hazardRates.length; i++) {
        thePool.add(names[i], issuers[i], new NorthAmericaCorpDefaultKey(new EURCurrency(), Seniority.SeniorSec, new Period(), 1.));
    }
    const theBskt = new Basket(todaysDate, names, Array1D.fromSizeValue(hazardRates.length, 100.), thePool, 0.03, .06);
    const recoveries = Array1D.fromSizeValue(hazardRates.length, 0.4);
    const calcDate = new TARGET().advance1(Settings.evaluationDate.f(), 60, TimeUnit.Months);
    const factorValue = 0.05;
    const fctrsWeights = Array2D.newMatrix(hazardRates.length, 1, Math.sqrt(factorValue));
    const lmGLHP = new GaussianLHPLossModel();
    theBskt.setLossModel(lmGLHP);
    print(`GLHP Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const ktLossLM = new ConstantLossLatentmodel().init1(fctrsWeights, recoveries, LatentModelIntegrationType.LatentModelIntegrationType
        .GaussianQuadrature, null);
    const lmBinomial = new BinomialLossModel(ktLossLM);
    theBskt.setLossModel(lmBinomial);
    print(`Gaussian Binomial Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const initT = new TCopulaPolicy.initTraits();
    const ktTLossLM = new ConstantLossLatentmodel().init1(fctrsWeights, recoveries, LatentModelIntegrationType.LatentModelIntegrationType.Trapezoid, initT);
    const lmTBinomial = new BinomialLossModel(ktTLossLM);
    theBskt.setLossModel(lmTBinomial);
    print(`T Binomial Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const numSimulations = 100000;
    const gLM = new ConstantLossLatentmodel().init1(fctrsWeights, recoveries, LatentModelIntegrationType.LatentModelIntegrationType
        .GaussianQuadrature, null);
    const numBuckets = 100;
    const inhomogeneousLM = new InhomogeneousPoolLossModel(gLM, numBuckets);
    theBskt.setLossModel(inhomogeneousLM);
    print(`G Inhomogeneous Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const rdlmG = new RandomDefaultLM().init1(gLM, recoveries, numSimulations, 1.e-6, 2863311530);
    theBskt.setLossModel(rdlmG);
    print(`Random G Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const rdlmT = new RandomDefaultLM().init1(ktTLossLM, recoveries, numSimulations, 1.e-6, 2863311530);
    theBskt.setLossModel(rdlmT);
    print(`Random T Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const fctrsWeightsRR = Array2D.newMatrix(2 * hazardRates.length, 1, Math.sqrt(factorValue));
    const modelA = 2.2;
    const sptLG = new SpotRecoveryLatentModel(fctrsWeightsRR, recoveries, modelA, LatentModelIntegrationType.LatentModelIntegrationType.GaussianQuadrature, null);
    const sptLT = new SpotRecoveryLatentModel(fctrsWeightsRR, recoveries, modelA, LatentModelIntegrationType.LatentModelIntegrationType.GaussianQuadrature, initT);
    const rdLlmG = new RandomLossLM(sptLG, numSimulations, 1.e-6, 2863311530);
    theBskt.setLossModel(rdLlmG);
    print(`Random Loss G Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const rdLlmT = new RandomLossLM(sptLT, numSimulations, 1.e-6, 2863311530);
    theBskt.setLossModel(rdLlmT);
    print(`Random Loss T Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const bcTenors = [
        new Period().init1(1, TimeUnit.Years), new Period().init1(5, TimeUnit.Years)
    ];
    const bcLossPercentages = [0.03, 0.12];
    const correls = [];
    const corr1Y = [];
    corr1Y.push(new Handle(new SimpleQuote(fctrsWeights[0][0] * fctrsWeights[0][0])));
    corr1Y.push(new Handle(new SimpleQuote(fctrsWeights[0][0] * fctrsWeights[0][0])));
    correls.push(corr1Y);
    const corr2Y = [];
    corr2Y.push(new Handle(new SimpleQuote(fctrsWeights[0][0] * fctrsWeights[0][0])));
    corr2Y.push(new Handle(new SimpleQuote(fctrsWeights[0][0] * fctrsWeights[0][0])));
    correls.push(corr2Y);
    const correlSurface = new BaseCorrelationTermStructure(defTS[0].currentLink().settlementDays(), defTS[0].currentLink().calendar(), BusinessDayConvention.Unadjusted, bcTenors, bcLossPercentages, correls, new Actual365Fixed());
    const correlHandle = new Handle(correlSurface);
    const bcLMG_LHP_Bilin = new BaseCorrelationLossModel(correlHandle, recoveries, null);
    theBskt.setLossModel(bcLMG_LHP_Bilin);
    print(`Base Correlation GLHP Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);

});