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
import { ActualActual, BusinessDayConvention, Callability, CallableFixedRateBond, Compounding, DateGeneration, FlatForward, Frequency, Handle, HullWhite, InterestRate, NullCalendar, Period, QL_EPSILON, Schedule, Settings, SimpleQuote, TimeUnit, TreeCallableFixedRateBondEngine, UnitedStates, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

function flatRate1(today, forward, dc, compounding, frequency) {
    return new FlatForward().ffInit1(today, new Handle(forward), dc, compounding, frequency);
}

function flatRate2(today, forward, dc, compounding, frequency) {
    return flatRate1(today, new SimpleQuote(forward), dc, compounding, frequency);
}

describe(`callable bonds example ${version}`, () => { 
    
    const today = new Date('16-October-2007');
    Settings.evaluationDate.set(today);
    print('Pricing a callable fixed rate bond using\n' +
        'Hull White model w/ reversion parameter = 0.03\n' +
        'BAC4.65 09/15/12  ISIN: US06060WBJ36\n' +
        'roughly five year tenor, ' +
        'quarterly coupon and call dates\n' +
        `reference date is : ${today}`);
    const bbCurveRate = 0.055;
    const bbDayCounter = new ActualActual(ActualActual.Convention.Bond);
    const bbIR = new InterestRate(bbCurveRate, bbDayCounter, Compounding.Compounded, Frequency.Semiannual);
    const termStructure = new Handle(flatRate2(today, bbIR.rate(), bbIR.dayCounter(), bbIR.compounding(), bbIR.frequency()));
    const callSchedule = [];
    const callPrice = 100.;
    const numberOfCallDates = 24;
    let callDate = new Date('15-September-2006');
    for (let i = 0; i < numberOfCallDates; i++) {
        const nullCalendar = new NullCalendar();
        const myPrice = new Callability.Price().init2(callPrice, Callability.Price.Type.Clean);
        callSchedule.push(new Callability(myPrice, Callability.Type.Call, callDate));
        callDate = nullCalendar.advance1(callDate, 3, TimeUnit.Months);
    }
    const dated = new Date('16-September-2004');
    const issue = dated;
    const maturity = new Date('15-September-2012');
    const settlementDays = 3;
    const bondCalendar = new UnitedStates(UnitedStates.Market.GovernmentBond);
    const coupon = .0465;
    const frequency = Frequency.Quarterly;
    const redemption = 100.0;
    const faceAmount = 100.0;
    const bondDayCounter = new ActualActual(ActualActual.Convention.Bond);
    const accrualConvention = BusinessDayConvention.Unadjusted;
    const paymentConvention = BusinessDayConvention.Unadjusted;
    const sch = new Schedule().init2(dated, maturity, new Period().init2(frequency), bondCalendar, accrualConvention, accrualConvention, DateGeneration.Rule.Backward, false);
    const maxIterations = 1000;
    const accuracy = 1e-8;
    const gridIntervals = 40;
    const reversionParameter = .03;
    let sigma = QL_EPSILON;
    const hw0 = new HullWhite(termStructure, reversionParameter, sigma);
    const engine0 = new TreeCallableFixedRateBondEngine().tcfrbeInit1(hw0, gridIntervals);
    const callableBond = new CallableFixedRateBond(settlementDays, faceAmount, sch, [coupon], bondDayCounter, paymentConvention, redemption, issue, callSchedule);
    callableBond.setPricingEngine(engine0);
    print(`sigma/vol (%) = ${100. * sigma}`);
    print('QuantLib price/yld (%)  ');
    print(`${callableBond.cleanPrice1()} / ` +
        `${100. *
            callableBond.yield1(bondDayCounter, Compounding.Compounded, frequency, accuracy, maxIterations)}`);
    print('Bloomberg price/yld (%) ');
    print('96.50 / 5.47');
    sigma = .01;
    print(`sigma/vol (%) = ${100. * sigma}`);
    const hw1 = new HullWhite(termStructure, reversionParameter, sigma);
    const engine1 = new TreeCallableFixedRateBondEngine().tcfrbeInit1(hw1, gridIntervals);
    callableBond.setPricingEngine(engine1);
    print('QuantLib price/yld (%)  ');
    print(`${callableBond.cleanPrice1()} / ` +
        `${100. *
            callableBond.yield1(bondDayCounter, Compounding.Compounded, frequency, accuracy, maxIterations)}`);
    print('Bloomberg price/yld (%) ');
    print('95.68 / 5.66');
    sigma = .03;
    const hw2 = new HullWhite(termStructure, reversionParameter, sigma);
    const engine2 = new TreeCallableFixedRateBondEngine().tcfrbeInit1(hw2, gridIntervals);
    callableBond.setPricingEngine(engine2);
    print(`sigma/vol (%) = ${100. * sigma}`);
    print('QuantLib price/yld (%)  ');
    print(`${callableBond.cleanPrice1()} / ` +
        `${100. *
            callableBond.yield1(bondDayCounter, Compounding.Compounded, frequency, accuracy, maxIterations)}`);
    print('Bloomberg price/yld (%) ');
    print('92.34 / 6.49');
    sigma = .06;
    const hw3 = new HullWhite(termStructure, reversionParameter, sigma);
    const engine3 = new TreeCallableFixedRateBondEngine().tcfrbeInit1(hw3, gridIntervals);
    callableBond.setPricingEngine(engine3);
    print(`sigma/vol (%) = ${100. * sigma}`);
    print('QuantLib price/yld (%)  ');
    print(`${callableBond.cleanPrice1()} / ` +
        `${100. *
            callableBond.yield1(bondDayCounter, Compounding.Compounded, frequency, accuracy, maxIterations)}`);
    print('Bloomberg price/yld (%) ');
    print('87.16 / 7.83');
    sigma = .12;
    const hw4 = new HullWhite(termStructure, reversionParameter, sigma);
    const engine4 = new TreeCallableFixedRateBondEngine().tcfrbeInit1(hw4, gridIntervals);
    callableBond.setPricingEngine(engine4);
    print(`sigma/vol (%) = ${100. * sigma}`);
    print('QuantLib price/yld (%)  ');
    print(`${callableBond.cleanPrice1()} / ` +
        `${100. *
            callableBond.yield1(bondDayCounter, Compounding.Compounded, frequency, accuracy, maxIterations)}`);
    print('Bloomberg price/yld (%) ');
    print('77.31 / 10.65');

});