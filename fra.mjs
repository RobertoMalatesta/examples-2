import{ ActualActual, Compounding, DateExt, Discount, Euribor3M, ForwardRateAgreement, FraRateHelper, LogLinear, PiecewiseYieldCurve, Position, RelinkableHandle, Settings, SimpleQuote, TimeUnit, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

describe(`FRA example ${version}`, () => {
    
  const euriborTermStructure = new RelinkableHandle();
  const euribor3m = new Euribor3M(euriborTermStructure);
  const todaysDate = DateExt.UTC('23,May,2006');
  Settings.evaluationDate.set(todaysDate);
  const calendar = euribor3m.fixingCalendar();
  const fixingDays = euribor3m.fixingDays();
  const settlementDate =
      calendar.advance1(todaysDate, fixingDays, TimeUnit.Days);
  print(`Today : ${ todaysDate }`);
  print(`Settlement date : ${ settlementDate }`);
  print('   ');
  const threeMonthFraQuote = new Array(10);
  threeMonthFraQuote[1] = 0.030;
  threeMonthFraQuote[2] = 0.031;
  threeMonthFraQuote[3] = 0.032;
  threeMonthFraQuote[6] = 0.033;
  threeMonthFraQuote[9] = 0.034;
  const fra1x4Rate = new SimpleQuote(threeMonthFraQuote[1]);
  const fra2x5Rate = new SimpleQuote(threeMonthFraQuote[2]);
  const fra3x6Rate = new SimpleQuote(threeMonthFraQuote[3]);
  const fra6x9Rate = new SimpleQuote(threeMonthFraQuote[6]);
  const fra9x12Rate = new SimpleQuote(threeMonthFraQuote[9]);
  const h1x4 = new RelinkableHandle();
  h1x4.linkTo(fra1x4Rate);
  const h2x5 = new RelinkableHandle();
  h2x5.linkTo(fra2x5Rate);
  const h3x6 = new RelinkableHandle();
  h3x6.linkTo(fra3x6Rate);
  const h6x9 = new RelinkableHandle();
  h6x9.linkTo(fra6x9Rate);
  const h9x12 = new RelinkableHandle();
  h9x12.linkTo(fra9x12Rate);
  const fraDayCounter = euribor3m.dayCounter();
  const convention = euribor3m.businessDayConvention();
  const endOfMonth = euribor3m.endOfMonth();
  const fra1x4 = new FraRateHelper().frahInit1(
      h1x4, 1, 4, fixingDays, calendar, convention, endOfMonth, fraDayCounter);
  const fra2x5 = new FraRateHelper().frahInit1(
      h2x5, 2, 5, fixingDays, calendar, convention, endOfMonth, fraDayCounter);
  const fra3x6 = new FraRateHelper().frahInit1(
      h3x6, 3, 6, fixingDays, calendar, convention, endOfMonth, fraDayCounter);
  const fra6x9 = new FraRateHelper().frahInit1(
      h6x9, 6, 9, fixingDays, calendar, convention, endOfMonth, fraDayCounter);
  const fra9x12 =
      new FraRateHelper().frahInit1(h9x12, 9, 12, fixingDays, calendar,
                                    convention, endOfMonth, fraDayCounter);
  const termStructureDayCounter =
      new ActualActual(ActualActual.Convention.ISDA);
  const tolerance = 1.0e-15;
  const fraInstruments = [ fra1x4, fra2x5, fra3x6, fra6x9, fra9x12 ];
  const fraTermStructure =
      new PiecewiseYieldCurve(new Discount(), new LogLinear())
          .pwycInit2(settlementDate, fraInstruments, termStructureDayCounter,
                     tolerance);
  const discountingTermStructure = new RelinkableHandle();
  discountingTermStructure.linkTo(fraTermStructure);
  const fraCalendar = euribor3m.fixingCalendar();
  const fraBusinessDayConvention = euribor3m.businessDayConvention();
  const fraFwdType = Position.Type.Long;
  const fraNotional = 100.0;
  const fraTermMonths = 3;
  const monthsToStart = [ 1, 2, 3, 6, 9 ];
  euriborTermStructure.linkTo(fraTermStructure);
  print('Test FRA construction, NPV calculation, and FRA purchase');
  print('   ');
  let i;
  for (i = 0; i < monthsToStart.length; i++) {
    const fraValueDate =
        fraCalendar.advance1(settlementDate, monthsToStart[i], TimeUnit.Months,
                             fraBusinessDayConvention);
    const fraMaturityDate = fraCalendar.advance1(
        fraValueDate, fraTermMonths, TimeUnit.Months, fraBusinessDayConvention);
    const fraStrikeRate = threeMonthFraQuote[monthsToStart[i]];
    const myFRA = new ForwardRateAgreement(
        fraValueDate, fraMaturityDate, fraFwdType, fraStrikeRate, fraNotional,
        euribor3m, discountingTermStructure);
    print(`3m Term FRA, Months to Start: ${monthsToStart[i]}`);
    print(`strike FRA rate: ${fraStrikeRate}`);
    print(`FRA 3m forward rate: ${myFRA.forwardRate()}`);
    print(`FRA market quote: ${threeMonthFraQuote[monthsToStart[i]]}`);
    print(`FRA spot value: ${myFRA.spotValue()}`);
    print(`FRA forward value: ${myFRA.forwardValue()}`);
    print(`FRA implied Yield: ${
      myFRA.impliedYield(
        myFRA.spotValue(), myFRA.forwardValue(), settlementDate,
        Compounding.Simple, fraDayCounter)}`);
    print(`market Zero Rate: ${
      discountingTermStructure.currentLink().zeroRate1(
        fraMaturityDate, fraDayCounter, Compounding.Simple)}`);
    print(`FRA NPV [should be zero]: ${myFRA.NPV()}`);
    print('   ');
  }
  print('   ');
  print('Now take a 100 basis-point upward shift' +
              ' in FRA quotes and examine NPV');
  print('   ');
  const bpsShift = 0.01;
  threeMonthFraQuote[1] = 0.030 + bpsShift;
  threeMonthFraQuote[2] = 0.031 + bpsShift;
  threeMonthFraQuote[3] = 0.032 + bpsShift;
  threeMonthFraQuote[6] = 0.033 + bpsShift;
  threeMonthFraQuote[9] = 0.034 + bpsShift;
  fra1x4Rate.setValue(threeMonthFraQuote[1]);
  fra2x5Rate.setValue(threeMonthFraQuote[2]);
  fra3x6Rate.setValue(threeMonthFraQuote[3]);
  fra6x9Rate.setValue(threeMonthFraQuote[6]);
  fra9x12Rate.setValue(threeMonthFraQuote[9]);
  for (i = 0; i < monthsToStart.length; i++) {
    const fraValueDate =
        fraCalendar.advance1(settlementDate, monthsToStart[i], TimeUnit.Months,
                             fraBusinessDayConvention);
    const fraMaturityDate = fraCalendar.advance1(
        fraValueDate, fraTermMonths, TimeUnit.Months, fraBusinessDayConvention);
    const fraStrikeRate = threeMonthFraQuote[monthsToStart[i]] - bpsShift;
    const myFRA = new ForwardRateAgreement(
        fraValueDate, fraMaturityDate, fraFwdType, fraStrikeRate, fraNotional,
        euribor3m, discountingTermStructure);
    print(`3m Term FRA, 100 notional, Months to Start = ${monthsToStart[i]}`);
    print(`strike FRA rate: ${fraStrikeRate}`);
    print(`FRA 3m forward rate: ${myFRA.forwardRate()}`);
    print(`FRA market quote: ${threeMonthFraQuote[monthsToStart[i]]}`);
    print(`FRA spot value: ${myFRA.spotValue()}`);
    print(`FRA forward value: ${myFRA.forwardValue()}`);
    print(`FRA implied Yield: ${
      myFRA.impliedYield(
        myFRA.spotValue(), myFRA.forwardValue(), settlementDate,
        Compounding.Simple, fraDayCounter)}`);
    print(`market Zero Rate: ${
      discountingTermStructure.currentLink().zeroRate1(
        fraMaturityDate, fraDayCounter, Compounding.Simple)}`);
    print(`FRA NPV [should be positive]: ${myFRA.NPV()}`);
    print('   ');
  }

});