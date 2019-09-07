import { Actual365Fixed, AdditiveEQPBinomialTree, AmericanExercise, BinomialConvertibleEngine, BlackConstantVol, BlackScholesMertonProcess, BusinessDayConvention, Callability, ConvertibleFixedCouponBond, CoxRossRubinstein, DateExt, DateGeneration, EuropeanExercise, FixedDividend, FlatForward, Frequency, Handle, JarrowRudd, Joshi4, LeisenReimer, Option, Period, Schedule, Settings, SimpleQuote, SoftCallability, TARGET, Thirty360, Tian, TimeUnit, Trigeorgis } from '/ql.mjs';

describe('convertible bonds example', () => { 

    const type = Option.Type.Put;
    const underlying = 36.0;
    const spreadRate = 0.005;
    const dividendYield = 0.02;
    const riskFreeRate = 0.06;
    const volatility = 0.20;
    const settlementDays = 3;
    const length = 5;
    const redemption = 100.0;
    const conversionRatio = redemption / underlying;
    const calendar = new TARGET();
    const today = calendar.adjust(new Date());
    Settings.evaluationDate.set(today);
    const settlementDate = calendar.advance1(today, settlementDays, TimeUnit.Days);
    const exerciseDate = calendar.advance1(settlementDate, length, TimeUnit.Years);
    const issueDate = calendar.advance1(exerciseDate, -length, TimeUnit.Years);
    const convention = BusinessDayConvention.ModifiedFollowing;
    const frequency = Frequency.Annual;
    const schedule = new Schedule().init2(issueDate, exerciseDate, new Period().init2(frequency), calendar, convention, convention, DateGeneration.Rule.Backward, false);
    const dividends = [];
    const callability = [];
    const coupons = [0.05];
    const bondDayCount = new Thirty360();
    const callLength = [2, 4];
    const putLength = [3];
    const callPrices = [101.5, 100.85];
    const putPrices = [105.0];
    for (let i = 0; i < callLength.length; i++) {
        callability.push(new SoftCallability(new Callability.Price().init2(callPrices[i], Callability.Price.Type.Clean), schedule.date(callLength[i]), 1.20));
    }
    for (let j = 0; j < putLength.length; j++) {
        callability.push(new Callability(new Callability.Price().init2(putPrices[j], Callability.Price.Type.Clean), Callability.Type.Put, schedule.date(putLength[j])));
    }
    for (let d = DateExt.advance(today, 6, TimeUnit.Months); d.valueOf() < exerciseDate.valueOf(); d = DateExt.advance(d, 6, TimeUnit.Months)) {
        dividends.push(new FixedDividend(1.0, d));
    }
    const dayCounter = new Actual365Fixed();
    const maturity = dayCounter.yearFraction(settlementDate, exerciseDate);
    print(`option type ${type} \n` +
        `Time to maturity ${maturity} \n` +
        `Underlying price = ${underlying} \n` +
        `Risk-free interest rate = ${riskFreeRate} \n` +
        `Dividend yield = ${dividendYield} \n` +
        `Volatility = ${volatility} \n`);
    const exercise = new EuropeanExercise(exerciseDate);
    const amExercise = new AmericanExercise().init1(settlementDate, exerciseDate);
    const underlyingH = new Handle(new SimpleQuote(underlying));
    const flatTermStructure = new Handle(new FlatForward().ffInit2(settlementDate, riskFreeRate, dayCounter));
    const flatDividendTS = new Handle(new FlatForward().ffInit2(settlementDate, dividendYield, dayCounter));
    const flatVolTS = new Handle(new BlackConstantVol().bcvInit1(settlementDate, calendar, volatility, dayCounter));
    const stochasticProcess = new BlackScholesMertonProcess(underlyingH, flatDividendTS, flatTermStructure, flatVolTS);
    const timeSteps = 801;
    const creditSpread = new Handle(new SimpleQuote(spreadRate));
    const engine = new BinomialConvertibleEngine(new JarrowRudd())
        .bceInprint(stochasticProcess, timeSteps);
    const europeanBond = new ConvertibleFixedCouponBond(exercise, conversionRatio, dividends, callability, creditSpread, issueDate, settlementDays, coupons, bondDayCount, schedule, redemption);
    europeanBond.setPricingEngine(engine);
    const americanBond = new ConvertibleFixedCouponBond(amExercise, conversionRatio, dividends, callability, creditSpread, issueDate, settlementDays, coupons, bondDayCount, schedule, redemption);
    americanBond.setPricingEngine(engine);
    europeanBond.setPricingEngine(new BinomialConvertibleEngine(new JarrowRudd())
        .bceInprint(stochasticProcess, timeSteps));
    americanBond.setPricingEngine(new BinomialConvertibleEngine(new JarrowRudd())
        .bceInprint(stochasticProcess, timeSteps));
    print(`Jarrow-Rudd ${europeanBond.NPV()} \n` +
        `${americanBond.NPV()}`);
    europeanBond.setPricingEngine(new BinomialConvertibleEngine(new CoxRossRubinstein())
        .bceInprint(stochasticProcess, timeSteps));
    americanBond.setPricingEngine(new BinomialConvertibleEngine(new CoxRossRubinstein())
        .bceInprint(stochasticProcess, timeSteps));
    print(`Cox-Ross-Rubinstein ${europeanBond.NPV()} \n` +
        `${americanBond.NPV()}`);
    europeanBond.setPricingEngine(new BinomialConvertibleEngine(new AdditiveEQPBinomialTree())
        .bceInprint(stochasticProcess, timeSteps));
    americanBond.setPricingEngine(new BinomialConvertibleEngine(new AdditiveEQPBinomialTree())
        .bceInprint(stochasticProcess, timeSteps));
    print(`Additive equiprobabilities ${europeanBond.NPV()} \n` +
        `${americanBond.NPV()}`);
    europeanBond.setPricingEngine(new BinomialConvertibleEngine(new Trigeorgis())
        .bceInprint(stochasticProcess, timeSteps));
    americanBond.setPricingEngine(new BinomialConvertibleEngine(new Trigeorgis())
        .bceInprint(stochasticProcess, timeSteps));
    print(`Trigeorgis ${europeanBond.NPV()} \n` +
        `${americanBond.NPV()}`);
    europeanBond.setPricingEngine(new BinomialConvertibleEngine(new Tian())
        .bceInprint(stochasticProcess, timeSteps));
    americanBond.setPricingEngine(new BinomialConvertibleEngine(new Tian())
        .bceInprint(stochasticProcess, timeSteps));
    print(`Tian ${europeanBond.NPV()} \n` +
        `${americanBond.NPV()}`);
    europeanBond.setPricingEngine(new BinomialConvertibleEngine(new LeisenReimer())
        .bceInprint(stochasticProcess, timeSteps));
    americanBond.setPricingEngine(new BinomialConvertibleEngine(new LeisenReimer())
        .bceInprint(stochasticProcess, timeSteps));
    print(`Leisen-Reimer ${europeanBond.NPV()} \n` +
        `${americanBond.NPV()}`);
    europeanBond.setPricingEngine(new BinomialConvertibleEngine(new Joshi4())
        .bceInprint(stochasticProcess, timeSteps));
    americanBond.setPricingEngine(new BinomialConvertibleEngine(new Joshi4())
        .bceInprint(stochasticProcess, timeSteps));
    print(`Joshi ${europeanBond.NPV()} \n` +
        `${americanBond.NPV()}`);

});