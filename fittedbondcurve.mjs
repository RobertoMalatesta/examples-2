import { Array1D, BondFunctions, BusinessDayConvention, Compounding, CubicBSplinesFitting, DateGeneration, Discount, Duration, ExponentialSplinesFitting, FittedBondDiscountCurve, FixedRateBondHelper, FlatForward, Frequency, Handle, LogLinear, NelsonSiegelFitting, Period, PiecewiseYieldCurve, Schedule, Settings, SimpleDayCounter, SimplePolynomialFitting, SimpleQuote, SpreadFittingMethod, SvenssonFitting, TARGET, TimeUnit } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

function parRate(yts, dates, resultDayCounter) {
    if (dates.length < 2) {
        throw new Error('at least two dates are required');
    }
    let sum = 0.0;
    let dt;
    for (let i = 1; i < dates.length; ++i) {
        dt = resultDayCounter.yearFraction(dates[i - 1], dates[i]);
        if (dt < 0.0) {
            throw new Error('unsorted dates');
        }
        sum += yts.discount1(dates[i]) * dt;
    }
    const result = yts.discount1(dates[0]) - yts.discount1(Array1D.back(dates));
    return result / sum;
}

function printOutput(tag, curve) {
    print('reference date : \n' +
        `${curve.referenceDate()} \n` +
        'number of iterations : ' +
        `${curve.fitResults().numberOfIterations()}`);
}

describe('fitted bound curve example', () => { 

    const numberOfBonds = 15;
    const cleanPrice = new Array(numberOfBonds);
    for (let i = 0; i < numberOfBonds; i++) {
        cleanPrice[i] = 100.0;
    }
    const quote = [];
    for (let i = 0; i < numberOfBonds; i++) {
        const cp = new SimpleQuote(cleanPrice[i]);
        quote.push(cp);
    }
    const quoteHandle = new Array(numberOfBonds);
    for (let i = 0; i < numberOfBonds; i++) {
        quoteHandle[i].linkTo(quote[i]);
    }
    const lengths = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
    const coupons = [
        0.0200, 0.0225, 0.0250, 0.0275, 0.0300, 0.0325, 0.0350, 0.0375, 0.0400,
        0.0425, 0.0450, 0.0475, 0.0500, 0.0525, 0.0550
    ];
    const frequency = Frequency.Annual;
    const dc = new SimpleDayCounter();
    const accrualConvention = BusinessDayConvention.ModifiedFollowing;
    const convention = BusinessDayConvention.ModifiedFollowing;
    const redemption = 100.0;
    const calendar = new TARGET();
    let today = calendar.adjust(new Date());
    const origToday = new Date(today);
    Settings.evaluationDate.set(today);
    const bondSettlementDays = 0;
    const curveSettlementDays = 0;
    let bondSettlementDate = calendar.advance1(today, bondSettlementDays, TimeUnit.Days);
    print(`Today's date: ${today} \n` +
        `Bonds' settlement date: ${bondSettlementDate} \n` +
        'Calculating fit for 15 bonds.....');
    const instrumentsA = [];
    const instrumentsB = [];
    for (let j = 0; j < lengths.length; j++) {
        const maturity = calendar.advance1(bondSettlementDate, lengths[j], TimeUnit.Years);
        const schedule = new Schedule().init2(bondSettlementDate, maturity, new Period().init2(frequency), calendar, accrualConvention, accrualConvention, DateGeneration.Rule.Backward, false);
        const helperA = new FixedRateBondHelper(quoteHandle[j], bondSettlementDays, 100.0, schedule, [coupons[j]], dc, convention, redemption);
        const helperB = new FixedRateBondHelper(quoteHandle[j], bondSettlementDays, 100.0, schedule, [coupons[j]], dc, convention, redemption);
        instrumentsA.push(helperA);
        instrumentsB.push(helperB);
    }
    const constrainAtZero = true;
    const tolerance = 1.0e-10;
    const max = 5000;
    const ts0 = new PiecewiseYieldCurve(new Discount(), new LogLinear())
        .pwycInit4(curveSettlementDays, calendar, instrumentsB, dc);
    const exponentialSplines = new ExponentialSplinesFitting().esfInit1(constrainAtZero);
    const ts1 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, exponentialSplines, tolerance, max);
    printOutput('(a) exponential splines', ts1);
    const simplePolynomial = new SimplePolynomialFitting().spfInit1(3, constrainAtZero);
    const ts2 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, simplePolynomial, tolerance, max);
    printOutput('(b) simple polynomial', ts2);
    const nelsonSiegel = new NelsonSiegelFitting();
    const ts3 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, nelsonSiegel, tolerance, max);
    printOutput('(c) Nelson-Siegel', ts3);
    const knots = [-30.0, -20.0, 0.0, 5.0, 10.0, 15.0, 20.0, 25.0, 30.0, 40.0, 50.0];
    const knotVector = [];
    for (let i = 0; i < knots.length; i++) {
        knotVector.push(knots[i]);
    }
    const cubicBSplines = new CubicBSplinesFitting().cbsfInit1(knotVector, constrainAtZero);
    const ts4 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, cubicBSplines, tolerance, max);
    printOutput('(d) cubic B-splines', ts4);
    const svensson = new SvenssonFitting();
    const ts5 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, svensson, tolerance, max);
    printOutput('(e) Svensson', ts5);
    const discountCurve = new Handle(new FlatForward().ffInit4(curveSettlementDays, calendar, 0.01, dc));
    const nelsonSiegelSpread = new SpreadFittingMethod(new NelsonSiegelFitting(), discountCurve);
    const ts6 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, nelsonSiegelSpread, tolerance, max);
    printOutput('(f) Nelson-Siegel spreaded', ts6);
    print('Output par rates for each curve. In this case, ' +
        'par rates should equal coupons for these par bonds.');
    for (let i = 0; i < instrumentsA.length; i++) {
        const cfs = instrumentsA[i].bond().cashflows();
        const cfSize = instrumentsA[i].bond().cashflows().length;
        const keyDates = [];
        keyDates.push(bondSettlementDate);
        for (let j = 0; j < cfSize - 1; j++) {
            if (!cfs[j].hasOccurred(bondSettlementDate, false)) {
                const myDate = cfs[j].date();
                keyDates.push(myDate);
            }
        }
        const tenor = dc.yearFraction(today, cfs[cfSize - 1].date());
        print(`${tenor} | ${100. * coupons[i]} | ` +
            `${100. * parRate(ts0, keyDates, dc)} | ` +
            `${100. * parRate(ts1, keyDates, dc)} | ` +
            `${100. * parRate(ts2, keyDates, dc)} | ` +
            `${100. * parRate(ts3, keyDates, dc)} | ` +
            `${100. * parRate(ts4, keyDates, dc)} | ` +
            `${100. * parRate(ts5, keyDates, dc)} | ` +
            `${100. * parRate(ts6, keyDates, dc)}`);
    }
    print('Now add 23 months to today. Par rates should be ' +
        'automatically recalculated because today\'s date ' +
        'changes.  Par rates will NOT equal coupons (YTM ' +
        'will, with the correct compounding), but the ' +
        'piecewise yield curve par rates can be used as ' +
        'a benchmark for correct par rates.');
    today = calendar.advance1(origToday, 23, TimeUnit.Months, convention);
    Settings.evaluationDate.set(today);
    bondSettlementDate =
        calendar.advance1(today, bondSettlementDays, TimeUnit.Days);
    printOutput('(a) exponential splines', ts1);
    printOutput('(b) simple polynomial', ts2);
    printOutput('(c) Nelson-Siegel', ts3);
    printOutput('(d) cubic B-splines', ts4);
    printOutput('(e) Svensson', ts5);
    printOutput('(f) Nelson-Siegel spreaded', ts6);
    for (let i = 0; i < instrumentsA.length; i++) {
        const cfs = instrumentsA[i].bond().cashflows();
        const cfSize = instrumentsA[i].bond().cashflows().length;
        const keyDates = [];
        keyDates.push(bondSettlementDate);
        for (let j = 0; j < cfSize - 1; j++) {
            if (!cfs[j].hasOccurred(bondSettlementDate, false)) {
                const myDate = cfs[j].date();
                keyDates.push(myDate);
            }
        }
        const tenor = dc.yearFraction(today, cfs[cfSize - 1].date());
        print(`${tenor} | ${100. * coupons[i]} | ` +
            `${100. * parRate(ts0, keyDates, dc)} | ` +
            `${100. * parRate(ts1, keyDates, dc)} | ` +
            `${100. * parRate(ts2, keyDates, dc)} | ` +
            `${100. * parRate(ts3, keyDates, dc)} | ` +
            `${100. * parRate(ts4, keyDates, dc)} | ` +
            `${100. * parRate(ts5, keyDates, dc)} | ` +
            `${100. * parRate(ts6, keyDates, dc)}`);
    }
    print('Now add one more month, for a total of two years ' +
        'from the original date. The first instrument is ' +
        'now expired and par rates should again equal ' +
        'coupon values, since clean prices did not change.');
    std.erase(instrumentsA, 0, 1);
    std.erase(instrumentsB, 0, 1);
    today = calendar.advance1(origToday, 24, TimeUnit.Months, convention);
    Settings.evaluationDate.set(today);
    bondSettlementDate =
        calendar.advance1(today, bondSettlementDays, TimeUnit.Days);
    const ts00 = new PiecewiseYieldCurve(new Discount(), new LogLinear())
        .pwycInit4(curveSettlementDays, calendar, instrumentsB, dc);
    const ts11 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, exponentialSplines, tolerance, max);
    printOutput('(a) exponential splines', ts11);
    const ts22 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, simplePolynomial, tolerance, max);
    printOutput('(b) simple polynomial', ts22);
    const ts33 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, nelsonSiegel, tolerance, max);
    printOutput('(c) Nelson-Siegel', ts33);
    const ts44 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, cubicBSplines, tolerance, max);
    printOutput('(d) cubic B-splines', ts44);
    const ts55 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, svensson, tolerance, max);
    printOutput('(e) Svensson', ts55);
    const ts66 = new FittedBondDiscountCurve().fbdcInit1(curveSettlementDays, calendar, instrumentsA, dc, nelsonSiegelSpread, tolerance, max);
    printOutput('(f) Nelson-Siegel spreaded', ts66);
    for (let i = 0; i < instrumentsA.length; i++) {
        const cfs = instrumentsA[i].bond().cashflows();
        const cfSize = instrumentsA[i].bond().cashflows().length;
        const keyDates = [];
        keyDates.push(bondSettlementDate);
        for (let j = 0; j < cfSize - 1; j++) {
            if (!cfs[j].hasOccurred(bondSettlementDate, false)) {
                const myDate = cfs[j].date();
                keyDates.push(myDate);
            }
        }
        const tenor = dc.yearFraction(today, cfs[cfSize - 1].date());
        print(`${tenor} | ${100. * coupons[i]} | ` +
            `${100. * parRate(ts00, keyDates, dc)} | ` +
            `${100. * parRate(ts11, keyDates, dc)} | ` +
            `${100. * parRate(ts22, keyDates, dc)} | ` +
            `${100. * parRate(ts33, keyDates, dc)} | ` +
            `${100. * parRate(ts44, keyDates, dc)} | ` +
            `${100. * parRate(ts55, keyDates, dc)} | ` +
            `${100. * parRate(ts66, keyDates, dc)}`);
    }
    print('Now decrease prices by a small amount, corresponding' +
        'to a theoretical five basis point parallel + shift of' +
        'the yield curve. Because bond quotes change, the new ' +
        'par rates should be recalculated automatically.');
    for (let k = 0; k < lengths.length - 1; k++) {
        const P = instrumentsA[k].quote().currentLink().value();
        const b = instrumentsA[k].bond();
        const ytm = BondFunctions.yield1(b, P, dc, Compounding.Compounded, frequency, today);
        const dur = BondFunctions.duration2(b, ytm, dc, Compounding.Compounded, frequency, Duration.Type.Modified, today);
        const bpsChange = 5.;
        const deltaP = -dur * P * (bpsChange / 10000.);
        quote[k + 1].setValue(P + deltaP);
    }
    for (let i = 0; i < instrumentsA.length; i++) {
        const cfs = instrumentsA[i].bond().cashflows();
        const cfSize = instrumentsA[i].bond().cashflows().length;
        const keyDates = [];
        keyDates.push(bondSettlementDate);
        for (let j = 0; j < cfSize - 1; j++) {
            if (!cfs[j].hasOccurred(bondSettlementDate, false)) {
                const myDate = cfs[j].date();
                keyDates.push(myDate);
            }
        }
        const tenor = dc.yearFraction(today, cfs[cfSize - 1].date());
        print(`${tenor} | ${100. * coupons[i]} | ` +
            `${100. * parRate(ts00, keyDates, dc)} | ` +
            `${100. * parRate(ts11, keyDates, dc)} | ` +
            `${100. * parRate(ts22, keyDates, dc)} | ` +
            `${100. * parRate(ts33, keyDates, dc)} | ` +
            `${100. * parRate(ts44, keyDates, dc)} | ` +
            `${100. * parRate(ts55, keyDates, dc)} | ` +
            `${100. * parRate(ts66, keyDates, dc)}`);
    }

});