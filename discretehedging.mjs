import { Actual365Fixed, BlackCalculator, BlackConstantVol, BlackScholesMertonProcess, FlatForward, Handle, M_PI, MC, MonteCarloModel, Option, PathGenerator, PathPricer, PlainVanillaPayoff, PseudoRandom, RiskStatistics, SimpleQuote, TARGET, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

class ReplicationError {
    constructor(type, maturity, strike, s0, sigma, r) {
        this._maturity = maturity;
        this._payoff = new PlainVanillaPayoff(type, strike);
        this._s0 = s0;
        this._sigma = sigma;
        this._r = r;
        const rDiscount = Math.exp(-this._r * this._maturity);
        const qDiscount = 1.0;
        const forward = this._s0 * qDiscount / rDiscount;
        const stdDev = Math.sqrt(this._sigma * this._sigma * this._maturity);
        const payoff = new PlainVanillaPayoff(type, strike);
        const black = new BlackCalculator().init1(payoff, forward, stdDev, rDiscount);
        print(`Option value: ${black.value()}`);
        this._vega = black.vega(this._maturity);
    }
    compute(nTimeSteps, nSamples) {
        if (nTimeSteps <= 0) {
            throw new Error('the number of steps must be > 0');
        }
        const calendar = new TARGET();
        const today = new Date();
        const dayCount = new Actual365Fixed();
        const stateVariable = new Handle(new SimpleQuote(this._s0));
        const riskFreeRate = new Handle(new FlatForward().ffInit2(today, this._r, dayCount));
        const dividendYield = new Handle(new FlatForward().ffInit2(today, 0.0, dayCount));
        const volatility = new Handle(new BlackConstantVol().bcvInit1(today, calendar, this._sigma, dayCount));
        const diffusion = new BlackScholesMertonProcess(stateVariable, dividendYield, riskFreeRate, volatility);
        const rsg = new PseudoRandom().make_sequence_generator(nTimeSteps, 0);
        const brownianBridge = false;
        const myPathGenerator = new PathGenerator().init1(diffusion, this._maturity, nTimeSteps, rsg, brownianBridge);
        const myPathPricer = new ReplicationPathPricer(this._payoff.optionType(), this._payoff.strike(), this._r, this._maturity, this._sigma);
        const statisticsAccumulator = new RiskStatistics();
        const MCSimulation = new MonteCarloModel(MC.SingleVariate, new PseudoRandom())
            .mcmInit(myPathGenerator, myPathPricer, statisticsAccumulator, false);
        MCSimulation.addSamples(nSamples);
        const PLMean = MCSimulation.sampleAccumulator().mean();
        const PLStDev = MCSimulation.sampleAccumulator().standardDeviation();
        const PLSkew = MCSimulation.sampleAccumulator().skewness();
        const PLKurt = MCSimulation.sampleAccumulator().kurtosis();
        const theorStD = Math.sqrt(M_PI / 4 / nTimeSteps) * this._vega * this._sigma;
        print(`samples: ${nSamples}, trades: ${nTimeSteps},\n` +
            `P&L mean: ${PLMean}, P&L std. dev.: ${PLStDev}\n` +
            `Derman&Kamal formula: ${theorStD}\n` +
            `P&L shewness: ${PLSkew}, P&L kurtosis: ${PLKurt}`);
    }
}

class ReplicationPathPricer extends PathPricer {
    constructor(type, strike, r, maturity, sigma) {
        super();
        this._type = type;
        this._strike = strike;
        this._r = r;
        this._maturity = maturity;
        this._sigma = sigma;
        if (this._strike <= 0) {
            throw new Error('strike must be positive');
        }
        if (this._r < 0) {
            throw new Error('risk free rate (r) must be positive or zero');
        }
        if (this._maturity <= 0) {
            throw new Error('maturity must be positive');
        }
        if (this._sigma < 0) {
            throw new Error('volatility (sigma) must be positive or zero');
        }
    }
    f(path) {
        const n = path.length() - 1;
        if (n <= 0) {
            throw new Error('the path cannot be empty');
        }
        const dt = this._maturity / n;
        const stockDividendYield = 0.0;
        let t = 0;
        let stock = path.front;
        let money_account = 0.0;
        let rDiscount = Math.exp(-this._r * this._maturity);
        let qDiscount = Math.exp(-stockDividendYield * this._maturity);
        let forward = stock * qDiscount / rDiscount;
        let stdDev = Math.sqrt(this._sigma * this._sigma * this._maturity);
        const payoff = new PlainVanillaPayoff(this._type, this._strike);
        const black = new BlackCalculator().init1(payoff, forward, stdDev, rDiscount);
        money_account += black.value();
        let delta = black.delta(stock);
        let stockAmount = delta;
        money_account -= stockAmount * stock;
        for (let step = 0; step < n - 1; step++) {
            t += dt;
            money_account *= Math.exp(this._r * dt);
            stock = path.at(step + 1);
            rDiscount = Math.exp(-this._r * (this._maturity - t));
            qDiscount = Math.exp(-stockDividendYield * (this._maturity - t));
            forward = stock * qDiscount / rDiscount;
            stdDev = Math.sqrt(this._sigma * this._sigma * (this._maturity - t));
            const black = new BlackCalculator().init1(payoff, forward, stdDev, rDiscount);
            delta = black.delta(stock);
            money_account -= (delta - stockAmount) * stock;
            stockAmount = delta;
        }
        money_account *= Math.exp(this._r * dt);
        stock = path.at(n);
        const optionPayoff = new PlainVanillaPayoff(this._type, this._strike).f(stock);
        money_account -= optionPayoff;
        money_account += stockAmount * stock;
        return money_account;
    }
}

describe('discrete hedging example', () => {
    print(`${version}`);
    print('  ');
    
    const maturity = 1.0 / 12.0;
    const strike = 100;
    const underlying = 100;
    const volatility = 0.20;
    const riskFreeRate = 0.05;
    const rp = new ReplicationError(Option.Type.Call, maturity, strike, underlying, volatility, riskFreeRate);
    const scenarios = 50000;
    let hedgesNum;
    hedgesNum = 21;
    rp.compute(hedgesNum, scenarios);
    hedgesNum = 84;
    rp.compute(hedgesNum, scenarios);

});
