import { Actual365Fixed, Array1D, BermudanExercise, BlackKarasinski, BusinessDayConvention, DateGeneration, DiscountingSwapEngine, EndCriteria, Euribor6M, FdG2SwaptionEngine, FdHullWhiteSwaptionEngine, FlatForward, Frequency, G2, G2SwaptionEngine, Handle, HullWhite, JamshidianSwaptionEngine, LevenbergMarquardt, Period, Schedule, Settings, SimpleQuote, Swaption, SwaptionHelper, TARGET, Thirty360, TimeGrid, TimeUnit, TreeSwaptionEngine, VanillaSwap } from '/ql.mjs';

const numRows = 5;
const numCols = 5;
const swapLenghts = [1, 2, 3, 4, 5];
const swaptionVols = [
    0.1490, 0.1340, 0.1228, 0.1189, 0.1148, 0.1290, 0.1201, 0.1146, 0.1108,
    0.1040, 0.1149, 0.1112, 0.1070, 0.1010, 0.0957, 0.1047, 0.1021, 0.0980,
    0.0951, 0.1270, 0.1000, 0.0950, 0.0900, 0.1230, 0.1160
];

function calibrateModel(model, helpers) {
    const om = new LevenbergMarquardt();
    model.calibrate(helpers, om, new EndCriteria(400, 100, 1.0e-8, 1.0e-8, 1.0e-8));
    for (let i = 0; i < numRows; i++) {
        const j = numCols - i - 1;
        const k = i * numCols + j;
        const npv = helpers[i].modelValue();
        const implied = helpers[i].impliedVolatility(npv, 1e-4, 1000, 0.05, 0.50);
        const diff = implied - swaptionVols[k];
        print(`${i + 1} "x" ${swapLenghts[j]} : model " ${implied}` +
            `, market ${swaptionVols[k]} ${diff}`);
    }
}

describe('bermudan swaption example', () => { 

    const todaysDate = new Date('15-February-2002');
    const calendar = new TARGET();
    const settlementDate = new Date('19-February-2002');
    Settings.evaluationDate.set(todaysDate);
    const flatRate = new SimpleQuote(0.04875825);
    const rhTermStructure = new Handle(new FlatForward().ffInit1(settlementDate, new Handle(flatRate), new Actual365Fixed()));
    const fixedLegFrequency = Frequency.Annual;
    const fixedLegConvention = BusinessDayConvention.Unadjusted;
    const floatingLegConvention = BusinessDayConvention.ModifiedFollowing;
    const fixedLegDayCounter = new Thirty360(Thirty360.Convention.European);
    const floatingLegFrequency = Frequency.Semiannual;
    const type = VanillaSwap.Type.Payer;
    const dummyFixedRate = 0.03;
    const indexSixMonths = new Euribor6M(rhTermStructure);
    const startDate = calendar.advance1(settlementDate, 1, TimeUnit.Years, floatingLegConvention);
    const maturity = calendar.advance1(startDate, 5, TimeUnit.Years, floatingLegConvention);
    const fixedSchedule = new Schedule().init2(startDate, maturity, new Period().init2(fixedLegFrequency), calendar, fixedLegConvention, fixedLegConvention, DateGeneration.Rule.Forward, false);
    const floatSchedule = new Schedule().init2(startDate, maturity, new Period().init2(floatingLegFrequency), calendar, floatingLegConvention, floatingLegConvention, DateGeneration.Rule.Forward, false);
    const swap = new VanillaSwap(type, 1000.0, fixedSchedule, dummyFixedRate, fixedLegDayCounter, floatSchedule, indexSixMonths, 0.0, indexSixMonths.dayCounter());
    swap.setPricingEngine(new DiscountingSwapEngine(rhTermStructure));
    const fixedATMRate = swap.fairRate();
    const fixedOTMRate = fixedATMRate * 1.2;
    const fixedITMRate = fixedATMRate * 0.8;
    const atmSwap = new VanillaSwap(type, 1000.0, fixedSchedule, fixedATMRate, fixedLegDayCounter, floatSchedule, indexSixMonths, 0.0, indexSixMonths.dayCounter());
    const otmSwap = new VanillaSwap(type, 1000.0, fixedSchedule, fixedOTMRate, fixedLegDayCounter, floatSchedule, indexSixMonths, 0.0, indexSixMonths.dayCounter());
    const itmSwap = new VanillaSwap(type, 1000.0, fixedSchedule, fixedITMRate, fixedLegDayCounter, floatSchedule, indexSixMonths, 0.0, indexSixMonths.dayCounter());
    const swaptionMaturities = [];
    swaptionMaturities.push(new Period().init1(1, TimeUnit.Years));
    swaptionMaturities.push(new Period().init1(2, TimeUnit.Years));
    swaptionMaturities.push(new Period().init1(3, TimeUnit.Years));
    swaptionMaturities.push(new Period().init1(4, TimeUnit.Years));
    swaptionMaturities.push(new Period().init1(5, TimeUnit.Years));
    const swaptions = [];
    const times = [];
    let i;
    for (i = 0; i < numRows; i++) {
        const j = numCols - i - 1;
        const k = i * numCols + j;
        const vol = new SimpleQuote(swaptionVols[k]);
        swaptions.push(new SwaptionHelper().shInit1(swaptionMaturities[i], new Period().init1(swapLenghts[j], TimeUnit.Years), new Handle(vol), indexSixMonths, indexSixMonths.tenor(), indexSixMonths.dayCounter(), indexSixMonths.dayCounter(), rhTermStructure));
        Array1D.back(swaptions).addTimesTo(times);
    }
    const grid = new TimeGrid().init2(times, 0, 30);
    const modelG2 = new G2(rhTermStructure);
    const modelHW = new HullWhite(rhTermStructure);
    const modelHW2 = new HullWhite(rhTermStructure);
    const modelBK = new BlackKarasinski(rhTermStructure);
    print('G2 (analytic formulae) calibration');
    for (i = 0; i < swaptions.length; i++) {
        swaptions[i].setPricingEngine(new G2SwaptionEngine(modelG2, 6.0, 16));
    }
    calibrateModel(modelG2, swaptions);
    print('calibrated to:');
    print(`a     = ${modelG2.params()[0]}`);
    print(`sigma = ${modelG2.params()[1]}`);
    print(`b     = ${modelG2.params()[2]}`);
    print(`eta   = ${modelG2.params()[3]}`);
    print(`rho   = ${modelG2.params()[4]}`);
    print('Hull-White (analytic formulae) calibration');
    for (i = 0; i < swaptions.length; i++) {
        swaptions[i].setPricingEngine(new JamshidianSwaptionEngine(modelHW));
    }
    calibrateModel(modelHW, swaptions);
    print('calibrated to:');
    print(`a = ${modelHW.params()[0]}`);
    print(`sigma = ${modelHW.params()[1]}`);
    print('Hull-White (numerical) calibration');
    for (i = 0; i < swaptions.length; i++) {
        swaptions[i].setPricingEngine(new TreeSwaptionEngine().tseInit2(modelHW2, grid));
    }
    calibrateModel(modelHW2, swaptions);
    print('calibrated to:');
    print(`a = ${modelHW2.params()[0]}`);
    print(`sigma = ${modelHW2.params()[1]}`);
    print('Black-Karasinski (numerical) calibration');
    for (i = 0; i < swaptions.length; i++) {
        swaptions[i].setPricingEngine(new TreeSwaptionEngine().tseInit2(modelBK, grid));
    }
    calibrateModel(modelBK, swaptions);
    print('calibrated to:')
    print(`a = ${modelBK.params()[0]}`);
    print(`sigma = ${modelBK.params()[1]}`);
    print(`Payer bermudan swaption struck at ${fixedATMRate} (ATM)`);
    const bermudanDates = [];
    const leg = swap.fixedLeg();
    for (i = 0; i < leg.length; i++) {
        const coupon = leg[i];
        bermudanDates.push(coupon.accrualStartDate());
    }
    const bermudanExercise = new BermudanExercise(bermudanDates);
    const bermudanSwaption = new Swaption(atmSwap, bermudanExercise);
    bermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelG2, 50));
    print(`G2 (tree):      ${bermudanSwaption.NPV()}`);
    bermudanSwaption.setPricingEngine(new FdG2SwaptionEngine(modelG2));
    print(`G2 (fdm) :      ${bermudanSwaption.NPV()}`);
    bermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelHW, 50));
    print(`HW (tree):      ${bermudanSwaption.NPV()}`);
    bermudanSwaption.setPricingEngine(new FdHullWhiteSwaptionEngine(modelHW));
    print(`HW (fdm) :      ${bermudanSwaption.NPV()}`);
    bermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelHW2, 50));
    print(`HW (num, tree): ${bermudanSwaption.NPV()}`);
    bermudanSwaption.setPricingEngine(new FdHullWhiteSwaptionEngine(modelHW2));
    print(`HW (num, fdm) : ${bermudanSwaption.NPV()}`);
    bermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelBK, 50));
    print(`BK:             ${bermudanSwaption.NPV()}`);
    print(`Payer bermudan swaption struck at ${fixedOTMRate} (OTM)`);
    const otmBermudanSwaption = new Swaption(otmSwap, bermudanExercise);
    otmBermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelG2, 300));
    print(`G2 (tree):       ${otmBermudanSwaption.NPV()}`);
    otmBermudanSwaption.setPricingEngine(new FdG2SwaptionEngine(modelG2));
    print(`G2 (fdm) :       ${otmBermudanSwaption.NPV()}`);
    otmBermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelHW, 50));
    print(`HW (tree):       ${otmBermudanSwaption.NPV()}`);
    otmBermudanSwaption.setPricingEngine(new FdHullWhiteSwaptionEngine(modelHW));
    print(`HW (fdm) :       ${otmBermudanSwaption.NPV()}`);
    otmBermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelHW2, 50));
    print(`HW (num, tree):  ${otmBermudanSwaption.NPV()}`);
    otmBermudanSwaption.setPricingEngine(new FdHullWhiteSwaptionEngine(modelHW2));
    print(`HW (num, fdm):   ${otmBermudanSwaption.NPV()}`);
    otmBermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelBK, 50));
    print(`BK:              ${otmBermudanSwaption.NPV()}`);
    print(`Payer bermudan swaption struck at ${fixedITMRate} (ITM)`);
    const itmBermudanSwaption = new Swaption(itmSwap, bermudanExercise);
    itmBermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelG2, 50));
    print(`G2 (tree):       ${itmBermudanSwaption.NPV()}`);
    itmBermudanSwaption.setPricingEngine(new FdG2SwaptionEngine(modelG2));
    print(`G2 (fdm) :       ${itmBermudanSwaption.NPV()}`);
    itmBermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelHW, 50));
    print(`HW (tree):       ${itmBermudanSwaption.NPV()}`);
    itmBermudanSwaption.setPricingEngine(new FdHullWhiteSwaptionEngine(modelHW));
    print(`HW (fdm) :       ${itmBermudanSwaption.NPV()}`);
    itmBermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelHW2, 50));
    print(`HW (num, tree):  ${itmBermudanSwaption.NPV()}`);
    itmBermudanSwaption.setPricingEngine(new FdHullWhiteSwaptionEngine(modelHW2));
    print(`HW (num, fdm) :  ${itmBermudanSwaption.NPV()}`);
    itmBermudanSwaption.setPricingEngine(new TreeSwaptionEngine().tseInit1(modelBK, 50));
    print(`BK:              ${itmBermudanSwaption.NPV()}`);

});
