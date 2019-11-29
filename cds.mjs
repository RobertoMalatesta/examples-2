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
import { Actual360, Actual365Fixed, BackwardFlat, BusinessDayConvention, Compounding, CreditDefaultSwap, DateExt, DateGeneration, DepositRateHelper, Discount, EURCurrency, Euribor, FlatForward, FlatHazardRate, Frequency, Handle, HazardRate, IborIndex, IsdaCdsEngine, LogLinear, MakeSchedule, MidPointCdsEngine, Period, PiecewiseDefaultCurve, PiecewiseYieldCurve, Protection, Schedule, Settings, SimpleQuote, SpreadCdsHelper, SurvivalProbability, SwapRateHelper, TARGET, Thirty360, TimeUnit, WeekendsOnly, first, second, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

function example01() {
    const calendar = new TARGET();
    let todaysDate = DateExt.UTC('15,May,2007');
    todaysDate = calendar.adjust(todaysDate);
    Settings.evaluationDate.set(todaysDate);
    const flatRate = new SimpleQuote(0.01);
    const tsCurve = new Handle(new FlatForward().ffInit1(todaysDate, new Handle(flatRate), new Actual365Fixed()));
    const recovery_rate = 0.5;
    const quoted_spreads = [0.0150, 0.0150, 0.0150, 0.0150];
    const tenors = [];
    tenors.push(new Period().init1(3, TimeUnit.Months));
    tenors.push(new Period().init1(6, TimeUnit.Months));
    tenors.push(new Period().init1(1, TimeUnit.Years));
    tenors.push(new Period().init1(2, TimeUnit.Years));
    const maturities = [];
    for (let i = 0; i < 4; i++) {
        maturities.push(calendar.adjust(DateExt.advance(todaysDate, tenors[i].length(), tenors[i].units()), BusinessDayConvention.Following));
    }
    const instruments = [];
    for (let i = 0; i < 4; i++) {
        instruments.push(new SpreadCdsHelper().scdshInit1(new Handle(new SimpleQuote(quoted_spreads[i])), tenors[i], 0, calendar, Frequency.Quarterly, BusinessDayConvention.Following, DateGeneration.Rule.TwentiethIMM, new Actual365Fixed(), recovery_rate, tsCurve));
    }
    const hazardRateStructure = new PiecewiseDefaultCurve(new HazardRate(), new BackwardFlat())
        .pwdcInit1(todaysDate, instruments, new Actual365Fixed());
    const hr_curve_data = hazardRateStructure.nodes();
    print('Calibrated hazard rate values: ');
    for (let i = 0; i < hr_curve_data.length; i++) {
        print(`hazard rate on ${hr_curve_data[i][first]} is ${hr_curve_data[i][second]}`);
    }
    print('  ');
    print('Some survival probability values: ');
    print('1Y survival probability: ' +
        `${hazardRateStructure.survivalProbability1(DateExt.advance(todaysDate, 1, TimeUnit.Years))}`);
    print('               expected: 0.9704');
    print('2Y survival probability: ' +
        `${hazardRateStructure.survivalProbability1(DateExt.advance(todaysDate, 2, TimeUnit.Years))}`);
    print('               expected: 0.9418');
    const nominal = 1000000.0;
    const probability = new Handle(hazardRateStructure);
    const engine = new MidPointCdsEngine(probability, recovery_rate, tsCurve);
    let cdsSchedule = new MakeSchedule()
        .from(todaysDate)
        .to(maturities[0])
        .withFrequency(Frequency.Quarterly)
        .withCalendar(calendar)
        .withTerminationDateConvention(BusinessDayConvention.Unadjusted)
        .withRule(DateGeneration.Rule.TwentiethIMM)
        .f();
    const cds_3m = new CreditDefaultSwap().init1(Protection.Side.Seller, nominal, quoted_spreads[0], cdsSchedule, BusinessDayConvention.Following, new Actual365Fixed());
    cdsSchedule =
        new MakeSchedule()
            .from(todaysDate)
            .to(maturities[1])
            .withFrequency(Frequency.Quarterly)
            .withCalendar(calendar)
            .withTerminationDateConvention(BusinessDayConvention.Unadjusted)
            .withRule(DateGeneration.Rule.TwentiethIMM)
            .f();
    const cds_6m = new CreditDefaultSwap().init1(Protection.Side.Seller, nominal, quoted_spreads[1], cdsSchedule, BusinessDayConvention.Following, new Actual365Fixed());
    cdsSchedule =
        new MakeSchedule()
            .from(todaysDate)
            .to(maturities[2])
            .withFrequency(Frequency.Quarterly)
            .withCalendar(calendar)
            .withTerminationDateConvention(BusinessDayConvention.Unadjusted)
            .withRule(DateGeneration.Rule.TwentiethIMM)
            .f();
    const cds_1y = new CreditDefaultSwap().init1(Protection.Side.Seller, nominal, quoted_spreads[2], cdsSchedule, BusinessDayConvention.Following, new Actual365Fixed());
    cdsSchedule =
        new MakeSchedule()
            .from(todaysDate)
            .to(maturities[3])
            .withFrequency(Frequency.Quarterly)
            .withCalendar(calendar)
            .withTerminationDateConvention(BusinessDayConvention.Unadjusted)
            .withRule(DateGeneration.Rule.TwentiethIMM)
            .f();
    const cds_2y = new CreditDefaultSwap().init1(Protection.Side.Seller, nominal, quoted_spreads[3], cdsSchedule, BusinessDayConvention.Following, new Actual365Fixed());
    cds_3m.setPricingEngine(engine);
    cds_6m.setPricingEngine(engine);
    cds_1y.setPricingEngine(engine);
    cds_2y.setPricingEngine(engine);
    print('  ');
    print('Repricing of quoted CDSs employed for calibration: ');
    print(`3M fair spread: ${cds_3m.fairSpread()}`);
    print(`   NPV:         ${cds_3m.NPV()}`);
    print(`   default leg: ${cds_3m.defaultLegNPV()}`);
    print(`   coupon leg:  ${cds_3m.couponLegNPV()}`);
    print('  ');
    print(`6M fair spread: ${cds_6m.fairSpread()}`);
    print(`   NPV:         ${cds_6m.NPV()}`);
    print(`   default leg: ${cds_6m.defaultLegNPV()}`);
    print(`   coupon leg:  ${cds_6m.couponLegNPV()}`);
    print('  ');
    print(`1Y fair spread: ${cds_1y.fairSpread()}`);
    print(`   NPV:         ${cds_1y.NPV()}`);
    print(`   default leg: ${cds_1y.defaultLegNPV()}`);
    print(`   coupon leg:  ${cds_1y.couponLegNPV()}`);
    print('  ');
    print(`2Y fair spread: ${cds_2y.fairSpread()}`);
    print(`   NPV:         ${cds_2y.NPV()}`);
    print(`   default leg: ${cds_2y.defaultLegNPV()}`);
    print(`   coupon leg:  ${cds_2y.couponLegNPV()}`);
}

function example02() {
  const todaysDate = DateExt.UTC('25,September,2014');
  Settings.evaluationDate.set(todaysDate);
  const termDate = new TARGET().adjust(DateExt.advance(todaysDate, 2, TimeUnit.Years), BusinessDayConvention.Following);
  const cdsSchedule = new MakeSchedule()
      .from(todaysDate)
      .to(termDate)
      .withFrequency(Frequency.Quarterly)
      .withCalendar(new WeekendsOnly())
      .withConvention(BusinessDayConvention.ModifiedFollowing)
      .withTerminationDateConvention(BusinessDayConvention.ModifiedFollowing)
      .withRule(DateGeneration.Rule.CDS)
      .f();
  for (let i = 0; i < cdsSchedule.size(); ++i) {
      print(`${cdsSchedule.date(i)}`);
  }
  const evaluationDate = DateExt.UTC('21,October,2014');
  Settings.evaluationDate.set(evaluationDate);
  const dp1m = new DepositRateHelper().drhInit2(0.000060, new Period().init1(1, TimeUnit.Months), 2, new TARGET(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const dp2m = new DepositRateHelper().drhInit2(0.000450, new Period().init1(2, TimeUnit.Months), 2, new TARGET(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const dp3m = new DepositRateHelper().drhInit2(0.000810, new Period().init1(3, TimeUnit.Months), 2, new TARGET(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const dp6m = new DepositRateHelper().drhInit2(0.001840, new Period().init1(6, TimeUnit.Months), 2, new TARGET(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const dp9m = new DepositRateHelper().drhInit2(0.002560, new Period().init1(9, TimeUnit.Months), 2, new TARGET(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const dp12m = new DepositRateHelper().drhInit2(0.003370, new Period().init1(12, TimeUnit.Months), 2, new TARGET(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const euribor6m = new Euribor(new Period().init1(6, TimeUnit.Months));
  if (Settings.QL_USE_INDEXED_COUPON) {
      print('Warning: QL_USED_INDEXED_COUPON is defined, which is not ' +
          'precisely consistent with the specification of the ISDA rate curve.');
  }
  const sw2y = new SwapRateHelper().srhInit4(0.002230, new Period().init1(2, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw3y = new SwapRateHelper().srhInit4(0.002760, new Period().init1(3, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw4y = new SwapRateHelper().srhInit4(0.003530, new Period().init1(4, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw5y = new SwapRateHelper().srhInit4(0.004520, new Period().init1(5, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw6y = new SwapRateHelper().srhInit4(0.005720, new Period().init1(6, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw7y = new SwapRateHelper().srhInit4(0.007050, new Period().init1(7, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw8y = new SwapRateHelper().srhInit4(0.008420, new Period().init1(8, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw9y = new SwapRateHelper().srhInit4(0.009720, new Period().init1(9, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw10y = new SwapRateHelper().srhInit4(0.010900, new Period().init1(10, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw12y = new SwapRateHelper().srhInit4(0.012870, new Period().init1(12, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw15y = new SwapRateHelper().srhInit4(0.014970, new Period().init1(15, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw20y = new SwapRateHelper().srhInit4(0.017000, new Period().init1(20, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw30y = new SwapRateHelper().srhInit4(0.018210, new Period().init1(30, TimeUnit.Years), new TARGET(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const isdaRateHelper = [];
  isdaRateHelper.push(dp1m);
  isdaRateHelper.push(dp2m);
  isdaRateHelper.push(dp3m);
  isdaRateHelper.push(dp6m);
  isdaRateHelper.push(dp9m);
  isdaRateHelper.push(dp12m);
  isdaRateHelper.push(sw2y);
  isdaRateHelper.push(sw3y);
  isdaRateHelper.push(sw4y);
  isdaRateHelper.push(sw5y);
  isdaRateHelper.push(sw6y);
  isdaRateHelper.push(sw7y);
  isdaRateHelper.push(sw8y);
  isdaRateHelper.push(sw9y);
  isdaRateHelper.push(sw10y);
  isdaRateHelper.push(sw12y);
  isdaRateHelper.push(sw15y);
  isdaRateHelper.push(sw20y);
  isdaRateHelper.push(sw30y);
  const rateTs = new Handle(new PiecewiseYieldCurve(new Discount(), new LogLinear())
      .pwycInit4(0, new WeekendsOnly(), isdaRateHelper, new Actual365Fixed()));
  rateTs.currentLink().enableExtrapolation();
  print('ISDA rate curve: ');
  for (let i = 0; i < isdaRateHelper.length; i++) {
      const d = isdaRateHelper[i].latestDate();
      print(`${d} ` +
          `${rateTs.currentLink()
              .zeroRate1(d, new Actual365Fixed(), Compounding.Continuous)
              .rate()} ` +
          `${rateTs.currentLink().discount1(d)}`);
  }
  const defaultTs0 = new FlatHazardRate().fhrInit4(0, new WeekendsOnly(), 0.016739207493630, new Actual365Fixed());
  const sched = new Schedule().init2(DateExt.UTC('22,September,2014'), DateExt.UTC('20,December,2019'), new Period().init1(3, TimeUnit.Months), new WeekendsOnly(), BusinessDayConvention.Following, BusinessDayConvention.Unadjusted, DateGeneration.Rule.CDS, false, null, null);
  const trade = new CreditDefaultSwap().init1(Protection.Side.Buyer, 100000000.0, 0.01, sched, BusinessDayConvention.Following, new Actual360(), true, true, DateExt.UTC('22,October,2014'), null, new Actual360(true), true);
  const cp = trade.coupons()[0];
  print(`first period = ${cp.accrualStartDate()} to ` +
      `${cp.accrualEndDate()} accrued amount = ` +
      `${cp.accruedAmount(DateExt.UTC('24,October,2014'))}`);
  const engine = new IsdaCdsEngine(new Handle(defaultTs0), 0.4, rateTs, false, IsdaCdsEngine.NumericalFix.Taylor, IsdaCdsEngine.AccrualBias.NoBias, IsdaCdsEngine.ForwardsInCouponPeriod.Piecewise);
  trade.setPricingEngine(engine);
  print(`reference trade NPV = ${trade.NPV()}`);
  const isdaCdsHelper = [];
  const cds5y = new SpreadCdsHelper().scdshInit2(0.00672658551, new Period().init1(54, TimeUnit.Months), 1, new WeekendsOnly(), Frequency.Quarterly, BusinessDayConvention.Following, DateGeneration.Rule.CDS, new Actual360(), 0.4, rateTs, true, true, null, new Actual360(true), true, CreditDefaultSwap.PricingModel.ISDA);
  isdaCdsHelper.push(cds5y);
  const defaultTs = new Handle(new PiecewiseDefaultCurve(new SurvivalProbability(), new LogLinear())
      .pwdcInit4(0, new WeekendsOnly(), isdaCdsHelper, new Actual365Fixed()));
  print('ISDA credit curve: ');
  for (let i = 0; i < isdaCdsHelper.length; i++) {
      const d = isdaCdsHelper[i].latestDate();
      const pd = defaultTs.currentLink().defaultProbability1(d);
      const t = defaultTs.currentLink().timeFromReference(d);
      print(`${d};${pd};${1.0 - pd};${-Math.log(1.0 - pd) / t}`);
  }
}

function example03() {
  const tradeDate = DateExt.UTC('13,June,2011');
  Settings.evaluationDate.set(tradeDate);
  const dp1m = new DepositRateHelper().drhInit2(0.00445, new Period().init1(1, TimeUnit.Months), 2, new WeekendsOnly(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const dp2m = new DepositRateHelper().drhInit2(0.00949, new Period().init1(2, TimeUnit.Months), 2, new WeekendsOnly(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const dp3m = new DepositRateHelper().drhInit2(0.01234, new Period().init1(3, TimeUnit.Months), 2, new WeekendsOnly(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const dp6m = new DepositRateHelper().drhInit2(0.01776, new Period().init1(6, TimeUnit.Months), 2, new WeekendsOnly(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const dp9m = new DepositRateHelper().drhInit2(0.01935, new Period().init1(9, TimeUnit.Months), 2, new WeekendsOnly(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const dp1y = new DepositRateHelper().drhInit2(0.02084, new Period().init1(12, TimeUnit.Months), 2, new WeekendsOnly(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const euribor6m = new IborIndex('IsdaIbor', new Period().init1(6, TimeUnit.Months), 2, new EURCurrency(), new WeekendsOnly(), BusinessDayConvention.ModifiedFollowing, false, new Actual360());
  const sw2y = new SwapRateHelper().srhInit4(0.01652, new Period().init1(2, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw3y = new SwapRateHelper().srhInit4(0.02018, new Period().init1(3, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw4y = new SwapRateHelper().srhInit4(0.02303, new Period().init1(4, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw5y = new SwapRateHelper().srhInit4(0.02525, new Period().init1(5, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw6y = new SwapRateHelper().srhInit4(0.02696, new Period().init1(6, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw7y = new SwapRateHelper().srhInit4(0.02825, new Period().init1(7, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw8y = new SwapRateHelper().srhInit4(0.02931, new Period().init1(8, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw9y = new SwapRateHelper().srhInit4(0.03017, new Period().init1(9, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw10y = new SwapRateHelper().srhInit4(0.03092, new Period().init1(10, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw11y = new SwapRateHelper().srhInit4(0.03160, new Period().init1(11, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw12y = new SwapRateHelper().srhInit4(0.03231, new Period().init1(12, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw15y = new SwapRateHelper().srhInit4(0.03367, new Period().init1(15, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw20y = new SwapRateHelper().srhInit4(0.03419, new Period().init1(20, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw25y = new SwapRateHelper().srhInit4(0.03411, new Period().init1(25, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const sw30y = new SwapRateHelper().srhInit4(0.03412, new Period().init1(30, TimeUnit.Years), new WeekendsOnly(), Frequency.Annual, BusinessDayConvention.ModifiedFollowing, new Thirty360(), euribor6m);
  const isdaYieldHelpers = [];
  isdaYieldHelpers.push(dp1m);
  isdaYieldHelpers.push(dp2m);
  isdaYieldHelpers.push(dp3m);
  isdaYieldHelpers.push(dp6m);
  isdaYieldHelpers.push(dp9m);
  isdaYieldHelpers.push(dp1y);
  isdaYieldHelpers.push(sw2y);
  isdaYieldHelpers.push(sw3y);
  isdaYieldHelpers.push(sw4y);
  isdaYieldHelpers.push(sw5y);
  isdaYieldHelpers.push(sw6y);
  isdaYieldHelpers.push(sw7y);
  isdaYieldHelpers.push(sw8y);
  isdaYieldHelpers.push(sw9y);
  isdaYieldHelpers.push(sw10y);
  isdaYieldHelpers.push(sw11y);
  isdaYieldHelpers.push(sw12y);
  isdaYieldHelpers.push(sw15y);
  isdaYieldHelpers.push(sw20y);
  isdaYieldHelpers.push(sw25y);
  isdaYieldHelpers.push(sw30y);
  const isdaYts = new Handle(new PiecewiseYieldCurve(new Discount(), new LogLinear())
      .pwycInit4(0, new WeekendsOnly(), isdaYieldHelpers, new Actual365Fixed()));
  isdaYts.currentLink().enableExtrapolation();
  const model = CreditDefaultSwap.PricingModel.ISDA;
  const cds6m = new SpreadCdsHelper().scdshInit2(0.007927, new Period().init1(6, TimeUnit.Months), 1, new WeekendsOnly(), Frequency.Quarterly, BusinessDayConvention.Following, DateGeneration.Rule.CDS, new Actual360(), 0.4, isdaYts, true, true, null, new Actual360(true), true, model);
  const cds1y = new SpreadCdsHelper().scdshInit2(0.007927, new Period().init1(1, TimeUnit.Years), 1, new WeekendsOnly(), Frequency.Quarterly, BusinessDayConvention.Following, DateGeneration.Rule.CDS, new Actual360(), 0.4, isdaYts, true, true, null, new Actual360(true), true, model);
  const cds3y = new SpreadCdsHelper().scdshInit2(0.012239, new Period().init1(3, TimeUnit.Years), 1, new WeekendsOnly(), Frequency.Quarterly, BusinessDayConvention.Following, DateGeneration.Rule.CDS, new Actual360(), 0.4, isdaYts, true, true, null, new Actual360(true), true, model);
  const cds5y = new SpreadCdsHelper().scdshInit2(0.016979, new Period().init1(5, TimeUnit.Years), 1, new WeekendsOnly(), Frequency.Quarterly, BusinessDayConvention.Following, DateGeneration.Rule.CDS, new Actual360(), 0.4, isdaYts, true, true, null, new Actual360(true), true, model);
  const cds7y = new SpreadCdsHelper().scdshInit2(0.019271, new Period().init1(7, TimeUnit.Years), 1, new WeekendsOnly(), Frequency.Quarterly, BusinessDayConvention.Following, DateGeneration.Rule.CDS, new Actual360(), 0.4, isdaYts, true, true, null, new Actual360(true), true, model);
  const cds10y = new SpreadCdsHelper().scdshInit2(0.020860, new Period().init1(10, TimeUnit.Years), 1, new WeekendsOnly(), Frequency.Quarterly, BusinessDayConvention.Following, DateGeneration.Rule.CDS, new Actual360(), 0.4, isdaYts, true, true, null, new Actual360(true), true, model);
  const isdaCdsHelpers = [];
  isdaCdsHelpers.push(cds6m);
  isdaCdsHelpers.push(cds1y);
  isdaCdsHelpers.push(cds3y);
  isdaCdsHelpers.push(cds5y);
  isdaCdsHelpers.push(cds7y);
  isdaCdsHelpers.push(cds10y);
  const isdaCts = new Handle(new PiecewiseDefaultCurve(new SurvivalProbability(), new LogLinear())
      .pwdcInit4(0, new WeekendsOnly(), isdaCdsHelpers, new Actual365Fixed()));
  print('ISDA yield curve:');
  print('date;time;zeroyield');
  for (let i = 0; i < isdaYieldHelpers.length; i++) {
      const d = isdaYieldHelpers[i].latestDate();
      const t = isdaYts.currentLink().timeFromReference(d);
      print(`${d};${t};` +
          `${isdaYts.currentLink()
              .zeroRate1(d, new Actual365Fixed(), Compounding.Continuous)
              .rate()}`);
  }
  print('ISDA credit curve:');
  print('date;time;survivalprob');
  for (let i = 0; i < isdaCdsHelpers.length; i++) {
      const d = isdaCdsHelpers[i].latestDate();
      const t = isdaCts.currentLink().timeFromReference(d);
      print(`${d};${t};` +
          `${isdaCts.currentLink().survivalProbability1(d)}`);
  }
}

describe(`cds example ${version}`, () => {
    print('***** Running example #1 *****');
    example01();
    print('  ');
    print('***** Running example #2 *****');
    example02();
    print('  ');
    print('***** Running example #3 *****');
    example03();

});
