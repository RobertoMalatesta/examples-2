import { Actual360, Actual365Fixed, ActualActual, BlackIborCouponPricer, BusinessDayConvention, Compounding, ConstantOptionletVolatility, DateGeneration, DepositRateHelper, Discount, DiscountingBondEngine, Euribor6M, FixedRateBond, FixedRateBondHelper, FloatingRateBond, Frequency, Handle, LogLinear, Period, PiecewiseYieldCurve, RelinkableHandle, Schedule, setCouponPricer, Settings, SimpleQuote, SwapRateHelper, TARGET, Thirty360, TimeUnit, UnitedStates, USDLibor, ZeroCouponBond } from '/ql.mjs';

example('bonds example', () => { 

    const calendar = new TARGET();
    let settlementDate = new Date('18-September-2008');
    settlementDate = calendar.adjust(settlementDate);
    const fixingDays = 3;
    const settlementDays = 3;
    const todaysDate = calendar.advance1(settlementDate, -fixingDays, TimeUnit.Days);
    Settings.evaluationDate.set(todaysDate);
    print(`Today: ${todaysDate}`);
    print(`Settlement date: ${settlementDate}`);
    const zc3mQuote = 0.0096;
    const zc6mQuote = 0.0145;
    const zc1yQuote = 0.0194;
    const zc3mRate = new SimpleQuote(zc3mQuote);
    const zc6mRate = new SimpleQuote(zc6mQuote);
    const zc1yRate = new SimpleQuote(zc1yQuote);
    const zcBondsDayCounter = new Actual365Fixed();
    const zc3m = new DepositRateHelper().drhInit1(new Handle(zc3mRate), new Period().init1(3, TimeUnit.Months), fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, zcBondsDayCounter);
    const zc6m = new DepositRateHelper().drhInit1(new Handle(zc6mRate), new Period().init1(6, TimeUnit.Months), fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, zcBondsDayCounter);
    const zc1y = new DepositRateHelper().drhInit1(new Handle(zc1yRate), new Period().init1(1, TimeUnit.Years), fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, zcBondsDayCounter);
    const redemption = 100.0;
    const numberOfBonds = 5;
    const issueDates = [
        new Date('15-March-2005'), new Date('15-June-2005'),
        new Date('30-June-2006'), new Date('15-November-2002'),
        new Date('15-May-1987')
    ];
    const maturities = [
        new Date('31-August-2010'), new Date('31-August-2011'),
        new Date('31-August-2013'), new Date('15-August-2018'),
        new Date('15-May-2038')
    ];
    const couponRates = [0.02375, 0.04625, 0.03125, 0.04000, 0.04500];
    const marketQuotes = [100.390625, 106.21875, 100.59375, 101.6875, 102.140625];
    const quote = [];
    for (let i = 0; i < numberOfBonds; i++) {
        const cp = new SimpleQuote(marketQuotes[i]);
        quote.push(cp);
    }
    const quoteHandle = new Array(numberOfBonds);
    for (let i = 0; i < numberOfBonds; i++) {
        quoteHandle[i] = new RelinkableHandle();
        quoteHandle[i].linkTo(quote[i]);
    }
    const bondsHelpers = [];
    for (let i = 0; i < numberOfBonds; i++) {
        const schedule = new Schedule().init2(issueDates[i], maturities[i], new Period().init2(Frequency.Semiannual), new UnitedStates(UnitedStates.Market.GovernmentBond), BusinessDayConvention.Unadjusted, BusinessDayConvention.Unadjusted, DateGeneration.Rule.Backward, false);
        const bondHelper = new FixedRateBondHelper(quoteHandle[i], settlementDays, 100.0, schedule, [couponRates[i]], new ActualActual(ActualActual.Convention.Bond), BusinessDayConvention.Unadjusted, redemption, issueDates[i]);
        bondsHelpers.push(bondHelper);
    }
    const termStructureDayCounter = new ActualActual(ActualActual.Convention.ISDA);
    const tolerance = 1.0e-15;
    const bondInstruments = [];
    bondInstruments.push(zc3m);
    bondInstruments.push(zc6m);
    bondInstruments.push(zc1y);
    for (let i = 0; i < numberOfBonds; i++) {
        bondInstruments.push(bondsHelpers[i]);
    }
    const bondDiscountingTermStructure = new PiecewiseYieldCurve(new Discount(), new LogLinear())
        .pwycInit2(settlementDate, bondInstruments, termStructureDayCounter, tolerance);
    const d1wQuote = 0.043375;
    const d1mQuote = 0.031875;
    const d3mQuote = 0.0320375;
    const d6mQuote = 0.03385;
    const d9mQuote = 0.0338125;
    const d1yQuote = 0.0335125;
    const s2yQuote = 0.0295;
    const s3yQuote = 0.0323;
    const s5yQuote = 0.0359;
    const s10yQuote = 0.0412;
    const s15yQuote = 0.0433;
    const d1wRate = new SimpleQuote(d1wQuote);
    const d1mRate = new SimpleQuote(d1mQuote);
    const d3mRate = new SimpleQuote(d3mQuote);
    const d6mRate = new SimpleQuote(d6mQuote);
    const d9mRate = new SimpleQuote(d9mQuote);
    const d1yRate = new SimpleQuote(d1yQuote);
    const s2yRate = new SimpleQuote(s2yQuote);
    const s3yRate = new SimpleQuote(s3yQuote);
    const s5yRate = new SimpleQuote(s5yQuote);
    const s10yRate = new SimpleQuote(s10yQuote);
    const s15yRate = new SimpleQuote(s15yQuote);
    const depositDayCounter = new Actual360();
    const d1w = new DepositRateHelper().drhInit1(new Handle(d1wRate), new Period().init1(1, TimeUnit.Weeks), fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    const d1m = new DepositRateHelper().drhInit1(new Handle(d1mRate), new Period().init1(1, TimeUnit.Months), fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    const d3m = new DepositRateHelper().drhInit1(new Handle(d3mRate), new Period().init1(3, TimeUnit.Months), fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    const d6m = new DepositRateHelper().drhInit1(new Handle(d6mRate), new Period().init1(6, TimeUnit.Months), fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    const d9m = new DepositRateHelper().drhInit1(new Handle(d9mRate), new Period().init1(9, TimeUnit.Months), fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    const d1y = new DepositRateHelper().drhInit1(new Handle(d1yRate), new Period().init1(1, TimeUnit.Years), fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    const swFixedLegFrequency = Frequency.Annual;
    const swFixedLegConvention = BusinessDayConvention.Unadjusted;
    const swFixedLegDayCounter = new Thirty360(Thirty360.Convention.European);
    const swFloatingLegIndex = new Euribor6M();
    const forwardStart = new Period().init1(1, TimeUnit.Days);
    const s2y = new SwapRateHelper().srhInit2(new Handle(s2yRate), new Period().init1(2, TimeUnit.Years), calendar, swFixedLegFrequency, swFixedLegConvention, swFixedLegDayCounter, swFloatingLegIndex, new Handle(), forwardStart);
    const s3y = new SwapRateHelper().srhInit2(new Handle(s3yRate), new Period().init1(3, TimeUnit.Years), calendar, swFixedLegFrequency, swFixedLegConvention, swFixedLegDayCounter, swFloatingLegIndex, new Handle(), forwardStart);
    const s5y = new SwapRateHelper().srhInit2(new Handle(s5yRate), new Period().init1(5, TimeUnit.Years), calendar, swFixedLegFrequency, swFixedLegConvention, swFixedLegDayCounter, swFloatingLegIndex, new Handle(), forwardStart);
    const s10y = new SwapRateHelper().srhInit2(new Handle(s10yRate), new Period().init1(10, TimeUnit.Years), calendar, swFixedLegFrequency, swFixedLegConvention, swFixedLegDayCounter, swFloatingLegIndex, new Handle(), forwardStart);
    const s15y = new SwapRateHelper().srhInit2(new Handle(s15yRate), new Period().init1(15, TimeUnit.Years), calendar, swFixedLegFrequency, swFixedLegConvention, swFixedLegDayCounter, swFloatingLegIndex, new Handle(), forwardStart);
    const depoSwapInstruments = [];
    depoSwapInstruments.push(d1w);
    depoSwapInstruments.push(d1m);
    depoSwapInstruments.push(d3m);
    depoSwapInstruments.push(d6m);
    depoSwapInstruments.push(d9m);
    depoSwapInstruments.push(d1y);
    depoSwapInstruments.push(s2y);
    depoSwapInstruments.push(s3y);
    depoSwapInstruments.push(s5y);
    depoSwapInstruments.push(s10y);
    depoSwapInstruments.push(s15y);
    const depoSwapTermStructure = new PiecewiseYieldCurve(new Discount(), new LogLinear())
        .pwycInit2(settlementDate, depoSwapInstruments, termStructureDayCounter, tolerance);
    const discountingTermStructure = new RelinkableHandle();
    const forecastingTermStructure = new RelinkableHandle();
    const faceAmount = 100;
    const bondEngine = new DiscountingBondEngine(discountingTermStructure);
    const zeroCouponBond = new ZeroCouponBond(settlementDays, new UnitedStates(UnitedStates.Market.GovernmentBond), faceAmount, new Date('15-August-2013'), BusinessDayConvention.Following, 116.92, new Date('15-August-2013'));
    zeroCouponBond.setPricingEngine(bondEngine);
    const fixedBondSchedule = new Schedule().init2(new Date('15-May-2007'), new Date('15-May-2017'), new Period().init2(Frequency.Semiannual), new UnitedStates(UnitedStates.Market.GovernmentBond), BusinessDayConvention.Unadjusted, BusinessDayConvention.Unadjusted, DateGeneration.Rule.Backward, false);
    const fixedRateBond = new FixedRateBond().frbInit1(settlementDays, faceAmount, fixedBondSchedule, [0.045], new ActualActual(ActualActual.Convention.Bond), BusinessDayConvention.ModifiedFollowing, 100.0, new Date('15-May-2007'));
    fixedRateBond.setPricingEngine(bondEngine);
    const liborTermStructure = new RelinkableHandle();
    const libor3m = new USDLibor(new Period().init1(3, TimeUnit.Months), liborTermStructure);
    libor3m.addFixing(new Date('17-July-2008'), 0.0278625);
    const floatingBondSchedule = new Schedule().init2(new Date('21-October-2005'), new Date('21-October-2010'), new Period().init2(Frequency.Quarterly), new UnitedStates(UnitedStates.Market.NYSE), BusinessDayConvention.Unadjusted, BusinessDayConvention.Unadjusted, DateGeneration.Rule.Backward, true);
    const floatingRateBond = new FloatingRateBond().frbInit1(settlementDays, faceAmount, floatingBondSchedule, libor3m, new Actual360(), BusinessDayConvention.ModifiedFollowing, 2, [1.0], [0.001], [], [], true, 100.0, new Date('21-October-2005'));
    floatingRateBond.setPricingEngine(bondEngine);
    const pricer = new BlackIborCouponPricer();
    const volatility = 0.0;
    let vol;
    vol = new Handle(new ConstantOptionletVolatility().covInit3(settlementDays, calendar, BusinessDayConvention.ModifiedFollowing, volatility, new Actual365Fixed()));
    pricer.setCapletVolatility(vol);
    setCouponPricer(floatingRateBond.cashflows(), pricer);
    forecastingTermStructure.linkTo(depoSwapTermStructure);
    discountingTermStructure.linkTo(bondDiscountingTermStructure);
    liborTermStructure.linkTo(depoSwapTermStructure);
    print('Net present value:\n' +
        `${zeroCouponBond.NPV()}\n` +
        `${fixedRateBond.NPV()}\n` +
        `${floatingRateBond.NPV()}`);
    print('Clean price:\n' +
        `${zeroCouponBond.cleanPrice1()}\n` +
        `${fixedRateBond.cleanPrice1()}\n` +
        `${floatingRateBond.cleanPrice1()}`);
    print('Dirty price:\n' +
        `${zeroCouponBond.dirtyPrice1()}\n` +
        `${fixedRateBond.dirtyPrice1()}\n` +
        `${floatingRateBond.dirtyPrice1()}`);
    print('Accrued coupon:\n' +
        `${zeroCouponBond.accruedAmount()}\n` +
        `${fixedRateBond.accruedAmount()}\n` +
        `${floatingRateBond.accruedAmount()}`);
    print('Previous coupon:\n' +
        'N/A\n' +
        `${fixedRateBond.previousCouponRate()}\n` +
        `${floatingRateBond.previousCouponRate()}`);
    print('Next coupon:\n' +
        'N/A\n' +
        `${fixedRateBond.nextCouponRate()}\n` +
        `${floatingRateBond.nextCouponRate()}`);
    print('Yield:\n' +
        `${zeroCouponBond.yield1(new Actual360(), Compounding.Compounded, Frequency.Annual)}\n` +
        `${fixedRateBond.yield1(new Actual360(), Compounding.Compounded, Frequency.Annual)}\n` +
        `${floatingRateBond.yield1(new Actual360(), Compounding.Compounded, Frequency.Annual)}`);
    print('Sample indirect computations (for the floating rate bond): ');
    print('Yield to Clean Price: \n' +
        `${floatingRateBond.cleanPrice2(floatingRateBond.yield1(new Actual360(), Compounding.Compounded, Frequency.Annual), new Actual360(), Compounding.Compounded, Frequency.Annual, settlementDate)}`);
    print('Clean Price to Yield: \n' +
        `${floatingRateBond.yield2(floatingRateBond.cleanPrice1(), new Actual360(), Compounding.Compounded, Frequency.Annual, settlementDate)}`);

});