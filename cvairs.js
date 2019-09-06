import { Actual360, ActualActual, BackwardFlat, BusinessDayConvention, CounterpartyAdjSwapEngine, Discount, DiscountingSwapEngine, Euribor3M, Frequency, Handle, InterpolatedHazardRateCurve, LogLinear, MakeVanillaSwap, Period, PiecewiseYieldCurve, Settings, SimpleQuote, SwapRateHelper, TARGET, TimeUnit, VanillaSwap } from '/ql.mjs';

describe('cvairs example', () => { 

    const calendar = new TARGET();
    let todaysDate = new Date('10-March-2004');
    todaysDate = calendar.adjust(todaysDate);
    Settings.evaluationDate.set(todaysDate);
    const yieldIndx = new Euribor3M();
    const tenorsSwapMkt = [5, 10, 15, 20, 25, 30];
    const ratesSwapmkt = [.03249, .04074, .04463, .04675, .04775, .04811];
    const swapHelpers = [];
    for (let i = 0; i < tenorsSwapMkt.length; i++) {
        swapHelpers.push(new SwapRateHelper().srhInit2(new Handle(new SimpleQuote(ratesSwapmkt[i])), new Period().init1(tenorsSwapMkt[i], TimeUnit.Years), new TARGET(), Frequency.Quarterly, BusinessDayConvention.ModifiedFollowing, new ActualActual(ActualActual.Convention.ISDA), yieldIndx));
    }
    const swapTS = new PiecewiseYieldCurve(new Discount(), new LogLinear())
        .pwycInit5(2, new TARGET(), swapHelpers, new ActualActual(ActualActual.Convention.ISDA), 1.0e-12);
    swapTS.enableExtrapolation();
    const riskFreeEngine = new DiscountingSwapEngine(new Handle(swapTS));
    const defaultIntensityTS = [];
    const defaultTenors = [0, 12, 36, 60, 84, 120, 180, 240, 300,
        360];
    const intensitiesLow = [
        0.0036, 0.0036, 0.0065, 0.0099, 0.0111, 0.0177, 0.0177, 0.0177, 0.0177,
        0.0177, 0.0177
    ];
    const intensitiesMedium = [
        0.0202, 0.0202, 0.0231, 0.0266, 0.0278, 0.0349, 0.0349, 0.0349, 0.0349,
        0.0349, 0.0349
    ];
    const intensitiesHigh = [
        0.0534, 0.0534, 0.0564, 0.06, 0.0614, 0.0696, 0.0696, 0.0696, 0.0696,
        0.0696, 0.0696
    ];
    const ctptyRRLow = 0.4, ctptyRRMedium = 0.35, ctptyRRHigh = 0.3;
    const defaultTSDates = [];
    const intesitiesVLow = [], intesitiesVMedium = [], intesitiesVHigh = [];
    for (let i = 0; i < defaultTenors.length; i++) {
        defaultTSDates.push(new TARGET().advance2(todaysDate, new Period().init1(defaultTenors[i], TimeUnit.Months)));
        intesitiesVLow.push(intensitiesLow[i]);
        intesitiesVMedium.push(intensitiesMedium[i]);
        intesitiesVHigh.push(intensitiesHigh[i]);
    }
    defaultIntensityTS.push(new Handle(new InterpolatedHazardRateCurve(new BackwardFlat())
        .curveInit2(defaultTSDates, intesitiesVLow, new Actual360(), new TARGET())));
    defaultIntensityTS.push(new Handle(new InterpolatedHazardRateCurve(new BackwardFlat())
        .curveInit2(defaultTSDates, intesitiesVMedium, new Actual360(), new TARGET())));
    defaultIntensityTS.push(new Handle(new InterpolatedHazardRateCurve(new BackwardFlat())
        .curveInit2(defaultTSDates, intesitiesVHigh, new Actual360(), new TARGET())));
    const blackVol = 0.15;
    const ctptySwapCvaLow = new CounterpartyAdjSwapEngine().init2(new Handle(swapTS), blackVol, defaultIntensityTS[0], ctptyRRLow);
    const ctptySwapCvaMedium = new CounterpartyAdjSwapEngine().init2(new Handle(swapTS), blackVol, defaultIntensityTS[1], ctptyRRMedium);
    const ctptySwapCvaHigh = new CounterpartyAdjSwapEngine().init2(new Handle(swapTS), blackVol, defaultIntensityTS[2], ctptyRRHigh);
    defaultIntensityTS[0].currentLink().enableExtrapolation();
    defaultIntensityTS[1].currentLink().enableExtrapolation();
    defaultIntensityTS[2].currentLink().enableExtrapolation();
    const fixedLegFrequency = Frequency.Quarterly;
    const fixedLegConvention = BusinessDayConvention.ModifiedFollowing;
    const fixedLegDayCounter = new ActualActual(ActualActual.Convention.ISDA);
    const swapType = VanillaSwap.Type.Payer;
    const yieldIndxS = new Euribor3M(new Handle(swapTS));
    const riskySwaps = [];
    for (let i = 0; i < tenorsSwapMkt.length; i++) {
        riskySwaps.push(new MakeVanillaSwap(new Period().init1(tenorsSwapMkt[i], TimeUnit.Years), yieldIndxS, ratesSwapmkt[i], new Period().init1(0, TimeUnit.Days))
            .withSettlementDays(2)
            .withFixedLegDayCount(fixedLegDayCounter)
            .withFixedLegTenor(new Period().init2(fixedLegFrequency))
            .withFixedLegConvention(fixedLegConvention)
            .withFixedLegTerminationDateConvention(fixedLegConvention)
            .withFixedLegCalendar(calendar)
            .withFloatingLegCalendar(calendar)
            .withNominal(100.)
            .withType(swapType)
            .f());
    }
    it('-- Correction in the contract fix rate in bp --',()=>{expect(true).toEqual(true);});
    for (let i = 0; i < riskySwaps.length; i++) {
        riskySwaps[i].setPricingEngine(riskFreeEngine);
        const nonRiskyFair = riskySwaps[i].fairRate();
        it(`${tenorsSwapMkt[i]} | ${nonRiskyFair} | `,()=>{expect(true).toEqual(true);});
        riskySwaps[i].setPricingEngine(ctptySwapCvaLow);
        it(`${10000. * (riskySwaps[i].fairRate() - nonRiskyFair)} | `,()=>{expect(true).toEqual(true);});
        riskySwaps[i].setPricingEngine(ctptySwapCvaMedium);
        it(`${10000. * (riskySwaps[i].fairRate() - nonRiskyFair)} | `,()=>{expect(true).toEqual(true);});
        riskySwaps[i].setPricingEngine(ctptySwapCvaHigh);
        it(`${10000. * (riskySwaps[i].fairRate() - nonRiskyFair)}\n`,()=>{expect(true).toEqual(true);});
    }

});