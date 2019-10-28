import { Actual365Fixed, BackwardFlat, BusinessDayConvention, CreditDefaultSwap, DateExt, DateGeneration, FlatForward, Frequency, Handle, HazardRate, MakeSchedule, MidPointCdsEngine, Period, PiecewiseDefaultCurve, Protection, Settings, SimpleQuote, SpreadCdsHelper, TARGET, TimeUnit, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

const first = 0, second = 1;
    
function example01() {
    const calendar = new TARGET();
    let todaysDate = new Date('15-May-2007');
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
    print('Some survival probability values: ');
    print('1Y survival probability: \n' +
        `${hazardRateStructure.survivalProbability1(DateExt.advance(todaysDate, 1, TimeUnit.Years))}\n` +
        'expected: 0.9704\n' +
        '2Y survival probability: \n' +
        `${hazardRateStructure.survivalProbability1(DateExt.advance(todaysDate, 2, TimeUnit.Years))}` +
        'expected: 0.9418\n');
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
    print('Repricing of quoted CDSs employed for calibration: ');
    print(`3M fair spread: ${cds_3m.fairSpread()}\n` +
        `   NPV:         ${cds_3m.NPV()}\n` +
        `   default leg: ${cds_3m.defaultLegNPV()}\n` +
        `   coupon leg:  ${cds_3m.couponLegNPV()}`);
    print(`6M fair spread: ${cds_6m.fairSpread()}\n` +
        `   NPV:         ${cds_6m.NPV()}\n` +
        `   default leg: ${cds_6m.defaultLegNPV()}\n` +
        `   coupon leg:  ${cds_6m.couponLegNPV()}`);
    print(`1Y fair spread: ${cds_1y.fairSpread()}\n` +
        `   NPV:         ${cds_1y.NPV()}\n` +
        `   default leg: ${cds_1y.defaultLegNPV()}\n` +
        `   coupon leg:  ${cds_1y.couponLegNPV()}`);
    print(`2Y fair spread: ${cds_2y.fairSpread()}\n` +
        `   NPV:         ${cds_2y.NPV()}\n` +
        `   default leg: ${cds_2y.defaultLegNPV()}\n` +
        `   coupon leg:  ${cds_2y.couponLegNPV()}`);
}

function example02() { }
function example03() { }

describe(`cds example ${version}`, () => { 
    
    example01();
    example02();
    example03();

});