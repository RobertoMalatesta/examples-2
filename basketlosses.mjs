/**
 * Copyright 2019 - 2020 Jin Yang. All Rights Reserved.
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
import { Actual365Fixed, Array1D, Array2D, BaseCorrelationTermStructure, Basket, Bilinear, BinomialLossModel, BoxMullerGaussianRng, BusinessDayConvention, ConstantLossLatentmodel, DateExt, EURCurrency, FlatHazardRate, GaussianConstantLossLM, GaussianCopulaPolicy, GaussianLHPFlatBCLM, GaussianLHPLossModel, GaussianSpotLossLM, Handle, IHGaussPoolLossModel, Issuer, LatentModelIntegrationType, MersenneTwisterUniformRng, NorthAmericaCorpDefaultKey, Period, PolarStudentTRng, Pool, RandomDefaultLM, RandomLossLM, RandomSequenceGenerator, Seniority, Settings, SimpleQuote, TARGET, TBinomialLossModel, TConstantLossLM, TCopulaPolicy, TimeUnit, TSpotLossLM, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

describe(`basket losses example ${version}`, () => { 

    const calendar = new TARGET();
    let todaysDate = DateExt.UTC('19,March,2014');
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
    const theBskt = new Basket().init(todaysDate, names, Array1D.fromSizeValue(hazardRates.length, 100.), thePool, 0.03, .06);
    const recoveries = Array1D.fromSizeValue(hazardRates.length, 0.4);
    const calcDate = new TARGET().advance1(Settings.evaluationDate.f(), 60, TimeUnit.Months);
    const factorValue = 0.05;
    const fctrsWeights = Array2D.newMatrix(hazardRates.length, 1, Math.sqrt(factorValue));
    const lmGLHP = new GaussianLHPLossModel().glhpmInit2(
      fctrsWeights[0][0] * fctrsWeights[0][0], recoveries);
    theBskt.setLossModel(lmGLHP);
    print(`GLHP Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const ktLossLM = new ConstantLossLatentmodel(new GaussianCopulaPolicy())
        .cllmInit1(fctrsWeights, recoveries, LatentModelIntegrationType.GaussianQuadrature, null);
    const lmBinomial = new BinomialLossModel(new GaussianConstantLossLM()).blmInit(ktLossLM);
    theBskt.setLossModel(lmBinomial);
    print(`Gaussian Binomial Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const initT = new TCopulaPolicy.initTraits();
    initT.tOrders = Array1D.fromSizeValue(2, 3);
    const ktTLossLM = new TConstantLossLM()
        .cllmInit1(fctrsWeights, recoveries, LatentModelIntegrationType.Trapezoid, initT);
    const lmTBinomial = new TBinomialLossModel().blmInit(ktTLossLM);
    theBskt.setLossModel(lmTBinomial);
    print(`T Binomial Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const numSimulations = 100000;
    const gLM = new GaussianConstantLossLM()
        .cllmInit1(fctrsWeights, recoveries, LatentModelIntegrationType.GaussianQuadrature, null);
    const numBuckets = 100;
    const inhomogeneousLM = new IHGaussPoolLossModel().ihplmInit(gLM, numBuckets);
    theBskt.setLossModel(inhomogeneousLM);
    print(`G Inhomogeneous Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const rdlmG = new RandomDefaultLM(new GaussianCopulaPolicy(),
                                      new RandomSequenceGenerator(
                                        new BoxMullerGaussianRng(
                                          new MersenneTwisterUniformRng())))
        .rdlmInit1(gLM, recoveries, numSimulations, 1.e-6, 2863311530);
    theBskt.setLossModel(rdlmG);
    print(`Random G Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const rdlmT = new RandomDefaultLM(new TCopulaPolicy(),
                                      new RandomSequenceGenerator(
                                        new PolarStudentTRng(
                                          new MersenneTwisterUniformRng())))
        .rdlmInit1(ktTLossLM, recoveries, numSimulations, 1.e-6, 2863311530);
    theBskt.setLossModel(rdlmT);
    print(`Random T Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const fctrsWeightsRR = Array2D.newMatrix(2 * hazardRates.length, 1, Math.sqrt(factorValue));
    const modelA = 2.2;
    const sptLG = new GaussianSpotLossLM().srlmInit(fctrsWeightsRR, recoveries, modelA, LatentModelIntegrationType.GaussianQuadrature, null);
    const sptLT = new TSpotLossLM().srlmInit(fctrsWeightsRR, recoveries, modelA, LatentModelIntegrationType.GaussianQuadrature, initT);
    const rdLlmG = new RandomLossLM(new GaussianCopulaPolicy())
        .rllmInit(sptLG, numSimulations, 1.e-6, 2863311530);
    theBskt.setLossModel(rdLlmG);
    print(`Random Loss G Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);
    const rdLlmT = new RandomLossLM(new TCopulaPolicy())
        .rllmInit(sptLT, numSimulations, 1.e-6, 2863311530);
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
    const correlSurface = new BaseCorrelationTermStructure(new Bilinear())
        .bctsInit(defTS[0].currentLink().settlementDays(), defTS[0].currentLink().calendar(), BusinessDayConvention.Unadjusted, bcTenors, bcLossPercentages, correls, new Actual365Fixed());
    const correlHandle = new Handle(correlSurface);
    const bcLMG_LHP_Bilin = new GaussianLHPFlatBCLM().bclmInit(correlHandle, recoveries, null);
    theBskt.setLossModel(bcLMG_LHP_Bilin);
    print(`Base Correlation GLHP Expected 10-Yr Losses: ${theBskt.expectedTrancheLoss(calcDate)}`);

});