import { Actual360, ActualActual, BusinessDayConvention, DateExt, DateGeneration, DepositRateHelper, Discount, DiscountingSwapEngine, Euribor6M, FraRateHelper, Frequency, FuturesRateHelper, Handle, IMM, LogLinear, Period, PiecewiseYieldCurve, RelinkableHandle, Schedule, Settings, SimpleQuote, SwapRateHelper, TARGET, Thirty360, TimeUnit, VanillaSwap } from '/ql.mjs';

describe('swap valuation example', () => { 

    const calendar = new TARGET();
    let settlementDate = new Date('22-September-2004');
    settlementDate = calendar.adjust(settlementDate);
    const fixingDays = 2;
    const todaysDate = calendar.advance1(settlementDate, -fixingDays, TimeUnit.Days);
    Settings.evaluationDate.set(todaysDate);
    it(`Today: ${todaysDate}`,()=>{expect(true).toEqual(true);});
    it(`Settlement date: ${settlementDate}`,()=>{expect(true).toEqual(true);});
    const d1wQuote = 0.0382;
    const d1mQuote = 0.0372;
    const d3mQuote = 0.0363;
    const d6mQuote = 0.0353;
    const d9mQuote = 0.0348;
    const d1yQuote = 0.0345;
    const fra3x6Quote = 0.037125;
    const fra6x9Quote = 0.037125;
    const fra6x12Quote = 0.037125;
    const fut1Quote = 96.2875;
    const fut2Quote = 96.7875;
    const fut3Quote = 96.9875;
    const fut4Quote = 96.6875;
    const fut5Quote = 96.4875;
    const fut6Quote = 96.3875;
    const fut7Quote = 96.2875;
    const fut8Quote = 96.0875;
    const s2yQuote = 0.037125;
    const s3yQuote = 0.0398;
    const s5yQuote = 0.0443;
    const s10yQuote = 0.05165;
    const s15yQuote = 0.055175;
    const d1wRate = new SimpleQuote(d1wQuote);
    const d1mRate = new SimpleQuote(d1mQuote);
    const d3mRate = new SimpleQuote(d3mQuote);
    const d6mRate = new SimpleQuote(d6mQuote);
    const d9mRate = new SimpleQuote(d9mQuote);
    const d1yRate = new SimpleQuote(d1yQuote);
    const fra3x6Rate = new SimpleQuote(fra3x6Quote);
    const fra6x9Rate = new SimpleQuote(fra6x9Quote);
    const fra6x12Rate = new SimpleQuote(fra6x12Quote);
    const fut1Price = new SimpleQuote(fut1Quote);
    const fut2Price = new SimpleQuote(fut2Quote);
    const fut3Price = new SimpleQuote(fut3Quote);
    const fut4Price = new SimpleQuote(fut4Quote);
    const fut5Price = new SimpleQuote(fut5Quote);
    const fut6Price = new SimpleQuote(fut6Quote);
    const fut7Price = new SimpleQuote(fut7Quote);
    const fut8Price = new SimpleQuote(fut8Quote);
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
    const fra3x6 = new FraRateHelper().frahInit1(new Handle(fra3x6Rate), 3, 6, fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    const fra6x9 = new FraRateHelper().frahInit1(new Handle(fra6x9Rate), 6, 9, fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    const fra6x12 = new FraRateHelper().frahInit1(new Handle(fra6x12Rate), 6, 12, fixingDays, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    const futMonths = 3;
    let imm = IMM.nextDate1(settlementDate);
    const fut1 = new FuturesRateHelper().frhInit1(new Handle(fut1Price), imm, futMonths, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    imm = IMM.nextDate1(DateExt.add(imm, 1));
    const fut2 = new FuturesRateHelper().frhInit1(new Handle(fut2Price), imm, futMonths, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    imm = IMM.nextDate1(DateExt.add(imm, 1));
    const fut3 = new FuturesRateHelper().frhInit1(new Handle(fut3Price), imm, futMonths, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    imm = IMM.nextDate1(DateExt.add(imm, 1));
    const fut4 = new FuturesRateHelper().frhInit1(new Handle(fut4Price), imm, futMonths, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    imm = IMM.nextDate1(DateExt.add(imm, 1));
    const fut5 = new FuturesRateHelper().frhInit1(new Handle(fut5Price), imm, futMonths, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    imm = IMM.nextDate1(DateExt.add(imm, 1));
    const fut6 = new FuturesRateHelper().frhInit1(new Handle(fut6Price), imm, futMonths, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    imm = IMM.nextDate1(DateExt.add(imm, 1));
    const fut7 = new FuturesRateHelper().frhInit1(new Handle(fut7Price), imm, futMonths, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    imm = IMM.nextDate1(DateExt.add(imm, 1));
    const fut8 = new FuturesRateHelper().frhInit1(new Handle(fut8Price), imm, futMonths, calendar, BusinessDayConvention.ModifiedFollowing, true, depositDayCounter);
    const swFixedLegFrequency = Frequency.Annual;
    const swFixedLegConvention = BusinessDayConvention.Unadjusted;
    const swFixedLegDayCounter = new Thirty360(Thirty360.Convention.European);
    const swFloatingLegIndex = new Euribor6M();
    const s2y = new SwapRateHelper().srhInit2(new Handle(s2yRate), new Period().init1(2, TimeUnit.Years), calendar, swFixedLegFrequency, swFixedLegConvention, swFixedLegDayCounter, swFloatingLegIndex);
    const s3y = new SwapRateHelper().srhInit2(new Handle(s3yRate), new Period().init1(3, TimeUnit.Years), calendar, swFixedLegFrequency, swFixedLegConvention, swFixedLegDayCounter, swFloatingLegIndex);
    const s5y = new SwapRateHelper().srhInit2(new Handle(s5yRate), new Period().init1(5, TimeUnit.Years), calendar, swFixedLegFrequency, swFixedLegConvention, swFixedLegDayCounter, swFloatingLegIndex);
    const s10y = new SwapRateHelper().srhInit2(new Handle(s10yRate), new Period().init1(10, TimeUnit.Years), calendar, swFixedLegFrequency, swFixedLegConvention, swFixedLegDayCounter, swFloatingLegIndex);
    const s15y = new SwapRateHelper().srhInit2(new Handle(s15yRate), new Period().init1(15, TimeUnit.Years), calendar, swFixedLegFrequency, swFixedLegConvention, swFixedLegDayCounter, swFloatingLegIndex);
    const termStructureDayCounter = new ActualActual(ActualActual.Convention.ISDA);
    const tolerance = 1.0e-15;
    const depoSwapInstruments = [d1w, d1m, d3m, d6m, d9m, d1y, s2y, s3y, s5y, s10y, s15y];
    const depoSwapTermStructure = new PiecewiseYieldCurve(new Discount(), new LogLinear())
        .pwycInit2(settlementDate, depoSwapInstruments, termStructureDayCounter, tolerance);
    const depoFutSwapInstruments = [
        d1w, d1m, fut1, fut2, fut3, fut4, fut5, fut6, fut7, fut8, s3y, s5y, s10y,
        s15y
    ];
    const depoFutSwapTermStructure = new PiecewiseYieldCurve(new Discount(), new LogLinear())
        .pwycInit2(settlementDate, depoFutSwapInstruments, termStructureDayCounter, tolerance);
    const depoFRASwapInstruments = [d1w, d1m, d3m, fra3x6, fra6x9, fra6x12, s2y, s3y, s5y, s10y, s15y];
    const depoFRASwapTermStructure = new PiecewiseYieldCurve(new Discount(), new LogLinear())
        .pwycInit2(settlementDate, depoFRASwapInstruments, termStructureDayCounter, tolerance);
    const discountingTermStructure = new RelinkableHandle();
    const forecastingTermStructure = new RelinkableHandle();
    const nominal = 1000000.0;
    const fixedLegFrequency = Frequency.Annual;
    const fixedLegConvention = BusinessDayConvention.Unadjusted;
    const floatingLegConvention = BusinessDayConvention.ModifiedFollowing;
    const fixedLegDayCounter = new Thirty360(Thirty360.Convention.European);
    const fixedRate = 0.04;
    const floatingLegDayCounter = new Actual360();
    const floatingLegFrequency = Frequency.Semiannual;
    const euriborIndex = new Euribor6M(forecastingTermStructure);
    const spread = 0.0;
    const lenghtInYears = 5;
    const swapType = VanillaSwap.Type.Payer;
    const maturity = DateExt.advance(settlementDate, lenghtInYears, TimeUnit.Years);
    const fixedSchedule = new Schedule().init2(settlementDate, maturity, new Period().init2(fixedLegFrequency), calendar, fixedLegConvention, fixedLegConvention, DateGeneration.Rule.Forward, false);
    const floatSchedule = new Schedule().init2(settlementDate, maturity, new Period().init2(floatingLegFrequency), calendar, floatingLegConvention, floatingLegConvention, DateGeneration.Rule.Forward, false);
    const spot5YearSwap = new VanillaSwap(swapType, nominal, fixedSchedule, fixedRate, fixedLegDayCounter, floatSchedule, euriborIndex, spread, floatingLegDayCounter);
    const fwdStart = calendar.advance1(settlementDate, 1, TimeUnit.Years);
    const fwdMaturity = DateExt.advance(fwdStart, lenghtInYears, TimeUnit.Years);
    const fwdFixedSchedule = new Schedule().init2(fwdStart, fwdMaturity, new Period().init2(fixedLegFrequency), calendar, fixedLegConvention, fixedLegConvention, DateGeneration.Rule.Forward, false);
    const fwdFloatSchedule = new Schedule().init2(fwdStart, fwdMaturity, new Period().init2(floatingLegFrequency), calendar, floatingLegConvention, floatingLegConvention, DateGeneration.Rule.Forward, false);
    const oneYearForward5YearSwap = new VanillaSwap(swapType, nominal, fwdFixedSchedule, fixedRate, fixedLegDayCounter, fwdFloatSchedule, euriborIndex, spread, floatingLegDayCounter);
    it(`5-year market swap-rate = ${s5yRate.value()}`,()=>{expect(true).toEqual(true);});
    it(`5-years swap paying ${fixedRate}`,()=>{expect(true).toEqual(true);});
    let NPV;
    let fairRate;
    let fairSpread;
    const swapEngine = new DiscountingSwapEngine(discountingTermStructure);
    spot5YearSwap.setPricingEngine(swapEngine);
    oneYearForward5YearSwap.setPricingEngine(swapEngine);
    forecastingTermStructure.linkTo(depoSwapTermStructure);
    discountingTermStructure.linkTo(depoSwapTermStructure);
    NPV = spot5YearSwap.NPV();
    fairSpread = spot5YearSwap.fairSpread();
    fairRate = spot5YearSwap.fairRate();
    it('term structure: depo-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});
    if (Math.abs(fairRate - s5yQuote) > 1e-8) {
        throw new Error('5-years swap mispriced');
    }
    forecastingTermStructure.linkTo(depoFutSwapTermStructure);
    discountingTermStructure.linkTo(depoFutSwapTermStructure);
    NPV = spot5YearSwap.NPV();
    fairSpread = spot5YearSwap.fairSpread();
    fairRate = spot5YearSwap.fairRate();
    it('term structure: depo-fut-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});
    if (Math.abs(fairRate - s5yQuote) > 1e-8) {
        throw new Error('5-years swap mispriced');
    }
    forecastingTermStructure.linkTo(depoFRASwapTermStructure);
    discountingTermStructure.linkTo(depoFRASwapTermStructure);
    NPV = spot5YearSwap.NPV();
    fairSpread = spot5YearSwap.fairSpread();
    fairRate = spot5YearSwap.fairRate();
    it('term structure: depo-FRA-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});
    if (Math.abs(fairRate - s5yQuote) > 1e-8) {
        throw new Error('5-years swap mispriced');
    }
    it(`5-years, 1-year forward swap paying ${fixedRate}`,()=>{expect(true).toEqual(true);});
    forecastingTermStructure.linkTo(depoSwapTermStructure);
    discountingTermStructure.linkTo(depoSwapTermStructure);
    NPV = oneYearForward5YearSwap.NPV();
    fairSpread = oneYearForward5YearSwap.fairSpread();
    fairRate = oneYearForward5YearSwap.fairRate();
    it('term structure: depo-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});
    forecastingTermStructure.linkTo(depoFutSwapTermStructure);
    discountingTermStructure.linkTo(depoFutSwapTermStructure);
    NPV = oneYearForward5YearSwap.NPV();
    fairSpread = oneYearForward5YearSwap.fairSpread();
    fairRate = oneYearForward5YearSwap.fairRate();
    it('term structure: depo-fut-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});
    forecastingTermStructure.linkTo(depoFRASwapTermStructure);
    discountingTermStructure.linkTo(depoFRASwapTermStructure);
    NPV = oneYearForward5YearSwap.NPV();
    fairSpread = oneYearForward5YearSwap.fairSpread();
    fairRate = oneYearForward5YearSwap.fairRate();
    it('term structure: depo-FRA-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});
    const fiveYearsRate = s5yRate;
    fiveYearsRate.setValue(0.0460);
    it(`5-year market swap-rate = ${s5yRate.value()}`,()=>{expect(true).toEqual(true);});
    it(`5-years swap paying ${fixedRate}`,()=>{expect(true).toEqual(true);});
    forecastingTermStructure.linkTo(depoSwapTermStructure);
    discountingTermStructure.linkTo(depoSwapTermStructure);
    NPV = spot5YearSwap.NPV();
    fairSpread = spot5YearSwap.fairSpread();
    fairRate = spot5YearSwap.fairRate();
    it('term structure: depo-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});
    if (Math.abs(fairRate - s5yRate.value()) > 1e-8) {
        throw new Error('5-years swap mispriced');
    }
    forecastingTermStructure.linkTo(depoFutSwapTermStructure);
    discountingTermStructure.linkTo(depoFutSwapTermStructure);
    NPV = spot5YearSwap.NPV();
    fairSpread = spot5YearSwap.fairSpread();
    fairRate = spot5YearSwap.fairRate();
    it('term structure: depo-fut-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});
    if (Math.abs(fairRate - s5yRate.value()) > 1e-8) {
        throw new Error('5-years swap mispriced');
    }
    forecastingTermStructure.linkTo(depoFRASwapTermStructure);
    discountingTermStructure.linkTo(depoFRASwapTermStructure);
    NPV = spot5YearSwap.NPV();
    fairSpread = spot5YearSwap.fairSpread();
    fairRate = spot5YearSwap.fairRate();
    it('term structure: depo-FRA-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});
    if (Math.abs(fairRate - s5yRate.value()) > 1e-8) {
        throw new Error('5-years swap mispriced');
    }
    it(`5-years, 1-year forward swap paying ${fixedRate}`,()=>{expect(true).toEqual(true);});
    forecastingTermStructure.linkTo(depoSwapTermStructure);
    discountingTermStructure.linkTo(depoSwapTermStructure);
    NPV = oneYearForward5YearSwap.NPV();
    fairSpread = oneYearForward5YearSwap.fairSpread();
    fairRate = oneYearForward5YearSwap.fairRate();
    it('term structure: depo-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});
    forecastingTermStructure.linkTo(depoFutSwapTermStructure);
    discountingTermStructure.linkTo(depoFutSwapTermStructure);
    NPV = oneYearForward5YearSwap.NPV();
    fairSpread = oneYearForward5YearSwap.fairSpread();
    fairRate = oneYearForward5YearSwap.fairRate();
    it('term structure: depo-fut-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});
    forecastingTermStructure.linkTo(depoFRASwapTermStructure);
    discountingTermStructure.linkTo(depoFRASwapTermStructure);
    NPV = oneYearForward5YearSwap.NPV();
    fairSpread = oneYearForward5YearSwap.fairSpread();
    fairRate = oneYearForward5YearSwap.fairRate();
    it('term structure: depo-FRA-swap\n' +
        `net present value: ${NPV}\n` +
        `fair spread: ${fairSpread}\n` +
        `fair fixed rate: ${fairRate}`,()=>{expect(true).toEqual(true);});

});