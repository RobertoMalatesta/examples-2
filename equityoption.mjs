import { Actual365Fixed, AdditiveEQPBinomialTree, AmericanExercise, AnalyticEuropeanEngine, AnalyticHestonEngine, BaroneAdesiWhaleyApproximationEngine, BatesEngine, BatesModel, BatesProcess, BermudanExercise, BinomialVanillaEngine, BjerksundStenslandApproximationEngine, BlackConstantVol, BlackScholesMertonProcess, CoxRossRubinstein, CrankNicolson, DateExt, EuropeanExercise, FDAmericanEngine, FDBermudanEngine, FDEuropeanEngine, FlatForward, Handle, HestonModel, HestonProcess, IntegralEngine, JarrowRudd, Joshi4, LeisenReimer, LowDiscrepancy, MakeMCAmericanEngine, MakeMCEuropeanEngine, Option, PlainVanillaPayoff, PseudoRandom, Settings, SimpleQuote, TARGET, Tian, TimeUnit, Trigeorgis, VanillaOption } from '/ql.mjs';

describe('equity option example', () => { 

    const calendar = new TARGET();
    const todaysDate = new Date('15-May-1998');
    const settlementDate = new Date('17-May-1998');
    Settings.evaluationDate.set(todaysDate);
    const type = Option.Type.Put;
    const underlying = 36;
    const strike = 40;
    const dividendYield = 0.00;
    const riskFreeRate = 0.06;
    const volatility = 0.20;
    const maturity = new Date('17-May-1999');
    const dayCounter = new Actual365Fixed();
    it(`Option type = ${type} \n` +
        `Maturity = ${maturity} \n` +
        `Underlying price = ${underlying}\n` +
        `Strike = ${strike}\n` +
        `Risk-free interest rate = ${riskFreeRate}\n` +
        `Dividend yield = ${dividendYield} \n` +
        `Volatility = ${volatility}`,()=>{expect(true).toEqual(true);});
    const exerciseDates = [];
    for (let i = 1; i <= 4; i++) {
        exerciseDates.push(DateExt.advance(settlementDate, 3 * i, TimeUnit.Months));
    }
    const europeanExercise = new EuropeanExercise(maturity);
    const bermudanExercise = new BermudanExercise(exerciseDates);
    const americanExercise = new AmericanExercise().init1(settlementDate, maturity);
    const underlyingH = new Handle(new SimpleQuote(underlying));
    const flatTermStructure = new Handle(new FlatForward().ffInit2(settlementDate, riskFreeRate, dayCounter));
    const flatDividendTS = new Handle(new FlatForward().ffInit2(settlementDate, dividendYield, dayCounter));
    const flatVolTS = new Handle(new BlackConstantVol().bcvInit1(settlementDate, calendar, volatility, dayCounter));
    const payoff = new PlainVanillaPayoff(type, strike);
    const bsmProcess = new BlackScholesMertonProcess(underlyingH, flatDividendTS, flatTermStructure, flatVolTS);
    const europeanOption = new VanillaOption(payoff, europeanExercise);
    const bermudanOption = new VanillaOption(payoff, bermudanExercise);
    const americanOption = new VanillaOption(payoff, americanExercise);
    europeanOption.setPricingEngine(new AnalyticEuropeanEngine().init1(bsmProcess));
    it(`Black-Scholes ${europeanOption.NPV()}`,()=>{expect(true).toEqual(true);});
    const hestonProcess = new HestonProcess(flatTermStructure, flatDividendTS, underlyingH, volatility * volatility, 1.0, volatility * volatility, 0.001, 0.0);
    const hestonModel = new HestonModel(hestonProcess);
    europeanOption.setPricingEngine(new AnalyticHestonEngine().aheInit2(hestonModel));
    it(`Heston semi-analytic ${europeanOption.NPV()}`,()=>{expect(true).toEqual(true);});
    const batesProcess = new BatesProcess(flatTermStructure, flatDividendTS, underlyingH, volatility * volatility, 1.0, volatility * volatility, 0.001, 0.0, 1e-14, 1e-14, 1e-14);
    const batesModel = new BatesModel(batesProcess);
    europeanOption.setPricingEngine(new BatesEngine().beInit1(batesModel));
    it(`Bates semi-analytic ${europeanOption.NPV()}`,()=>{expect(true).toEqual(true);});
    americanOption.setPricingEngine(new BaroneAdesiWhaleyApproximationEngine(bsmProcess));
    it(`Barone-Adesi/Whaley ${americanOption.NPV()}`,()=>{expect(true).toEqual(true);});
    americanOption.setPricingEngine(new BjerksundStenslandApproximationEngine(bsmProcess));
    it(`Bjerksund/Stensland ${americanOption.NPV()}`,()=>{expect(true).toEqual(true);});
    europeanOption.setPricingEngine(new IntegralEngine(bsmProcess));
    it(`Integral ${europeanOption.NPV()}`,()=>{expect(true).toEqual(true);});
    let timeSteps = 801;
    europeanOption.setPricingEngine(new FDEuropeanEngine(new CrankNicolson())
        .init1(bsmProcess, timeSteps, timeSteps - 1));
    bermudanOption.setPricingEngine(new FDBermudanEngine(new CrankNicolson())
        .init1(bsmProcess, timeSteps, timeSteps - 1));
    americanOption.setPricingEngine(new FDAmericanEngine(new CrankNicolson())
        .init(bsmProcess, timeSteps, timeSteps - 1));
    it(`Finite differences ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`,()=>{expect(true).toEqual(true);});
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new JarrowRudd())
        .bveInit(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new JarrowRudd())
        .bveInit(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new JarrowRudd())
        .bveInit(bsmProcess, timeSteps));
    it(`Binomial Jarrow-Rudd ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`,()=>{expect(true).toEqual(true);});
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new CoxRossRubinstein())
        .bveInit(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new CoxRossRubinstein())
        .bveInit(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new CoxRossRubinstein())
        .bveInit(bsmProcess, timeSteps));
    it(`Binomial Cox-Ross-Rubinstein ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`,()=>{expect(true).toEqual(true);});
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new AdditiveEQPBinomialTree())
        .bveInit(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new AdditiveEQPBinomialTree())
        .bveInit(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new AdditiveEQPBinomialTree())
        .bveInit(bsmProcess, timeSteps));
    it(`Additive equiprobabilities ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`,()=>{expect(true).toEqual(true);});
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new Trigeorgis())
        .bveInit(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new Trigeorgis())
        .bveInit(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new Trigeorgis())
        .bveInit(bsmProcess, timeSteps));
    it(`Binomial Trigeorgis ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`,()=>{expect(true).toEqual(true);});
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new Tian()).bveInit(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new Tian()).bveInit(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new Tian()).bveInit(bsmProcess, timeSteps));
    it(`Binomial Tian ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`,()=>{expect(true).toEqual(true);});
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new LeisenReimer())
        .bveInit(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new LeisenReimer())
        .bveInit(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new LeisenReimer())
        .bveInit(bsmProcess, timeSteps));
    it(`Binomial Leisen-Reimer ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`,()=>{expect(true).toEqual(true);});
    europeanOption.setPricingEngine(new BinomialVanillaEngine(new Joshi4()).bveInit(bsmProcess, timeSteps));
    bermudanOption.setPricingEngine(new BinomialVanillaEngine(new Joshi4()).bveInit(bsmProcess, timeSteps));
    americanOption.setPricingEngine(new BinomialVanillaEngine(new Joshi4()).bveInit(bsmProcess, timeSteps));
    it(`Binomial Joshi ${europeanOption.NPV()} \n` +
        `${bermudanOption.NPV()} \n` +
        `${americanOption.NPV()} \n`,()=>{expect(true).toEqual(true);});
    timeSteps = 1;
    const mcSeed = 42;
    const mcengine1 = new MakeMCEuropeanEngine(new PseudoRandom())
        .mmceeInit(bsmProcess)
        .withSteps(timeSteps)
        .withAbsoluteTolerance(0.02)
        .withSeed(mcSeed)
        .f();
    europeanOption.setPricingEngine(mcengine1);
    it(`MC (crude) ${europeanOption.NPV()}`,()=>{expect(true).toEqual(true);});
    const nSamples = 32768;
    const mcengine2 = new MakeMCEuropeanEngine(new LowDiscrepancy())
        .mmceeInit(bsmProcess)
        .withSteps(timeSteps)
        .withSamples(nSamples)
        .f();
    europeanOption.setPricingEngine(mcengine2);
    it(`QMC (Sobol) ${europeanOption.NPV()}`,()=>{expect(true).toEqual(true);});
    const mcengine3 = new MakeMCAmericanEngine(new PseudoRandom())
        .mmcaeInit(bsmProcess)
        .withSteps(100)
        .withAntitheticVariate()
        .withCalibrationSamples(4096)
        .withAbsoluteTolerance(0.02)
        .withSeed(mcSeed)
        .f();
    americanOption.setPricingEngine(mcengine3);
    it(`MC (Longstaff Schwartz) ${americanOption.NPV()}`,()=>{expect(true).toEqual(true);});

});