"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../src/settings");
var compounding_1 = require("../src/compounding");
var position_1 = require("../src/position");
var date_1 = require("../src/time/date");
var timeunit_1 = require("../src/time/timeunit");
var actualactual_1 = require("../src/time/daycounters/actualactual");
var handle_1 = require("../src/handle");
var simplequote_1 = require("../src/quotes/simplequote");
var euribor_1 = require("../src/indexes/ibor/euribor");
var loginterpolation_1 = require("../src/math/interpolations/loginterpolation");
var yieldtermstructure_1 = require("../src/termstructures/yieldtermstructure");
var piecewiseyieldcurve_1 = require("../src/termstructures/yield/piecewiseyieldcurve");
var ratehelpers_1 = require("../src/termstructures/yield/ratehelpers");
var forwardrateagreement_1 = require("../src/instruments/forwardrateagreement");
var bootstraptraits_1 = require("../src/termstructures/yield/bootstraptraits");
try {
    var startTime = new Date();
    var euriborTermStructure = new handle_1.RelinkableHandle(new yieldtermstructure_1.YieldTermStructure());
    var euribor3m = new euribor_1.Euribor3M(euriborTermStructure);
    var todaysDate = new Date(2006, date_1.Month.May - 1, 23);
    settings_1.Settings.evaluationDate = new settings_1.Settings.DateProxy(todaysDate);
    var calendar = euribor3m.fixingCalendar();
    var fixingDays = euribor3m.fixingDays();
    var settlementDate = calendar.advance1(todaysDate, fixingDays, timeunit_1.TimeUnit.Days);
    console.log("Today: " + todaysDate);
    console.log("Settlement date: " + settlementDate);
    var threeMonthFraQuote = new Array(10);
    threeMonthFraQuote[1] = 0.030;
    threeMonthFraQuote[2] = 0.031;
    threeMonthFraQuote[3] = 0.032;
    threeMonthFraQuote[6] = 0.033;
    threeMonthFraQuote[9] = 0.034;
    var fra1x4Rate = new simplequote_1.SimpleQuote(threeMonthFraQuote[1]);
    var fra2x5Rate = new simplequote_1.SimpleQuote(threeMonthFraQuote[2]);
    var fra3x6Rate = new simplequote_1.SimpleQuote(threeMonthFraQuote[3]);
    var fra6x9Rate = new simplequote_1.SimpleQuote(threeMonthFraQuote[6]);
    var fra9x12Rate = new simplequote_1.SimpleQuote(threeMonthFraQuote[9]);
    var h1x4 = new handle_1.RelinkableHandle();
    h1x4.linkTo(fra1x4Rate);
    var h2x5 = new handle_1.RelinkableHandle();
    h2x5.linkTo(fra2x5Rate);
    var h3x6 = new handle_1.RelinkableHandle();
    h3x6.linkTo(fra3x6Rate);
    var h6x9 = new handle_1.RelinkableHandle();
    h6x9.linkTo(fra6x9Rate);
    var h9x12 = new handle_1.RelinkableHandle();
    h9x12.linkTo(fra9x12Rate);
    var fraDayCounter = euribor3m.dayCounter();
    var convention = euribor3m.businessDayConvention();
    var endOfMonth = euribor3m.endOfMonth();
    var fra1x4 = new ratehelpers_1.FraRateHelper().frahInit1(h1x4, 1, 4, fixingDays, calendar, convention, endOfMonth, fraDayCounter);
    var fra2x5 = new ratehelpers_1.FraRateHelper().frahInit1(h2x5, 2, 5, fixingDays, calendar, convention, endOfMonth, fraDayCounter);
    var fra3x6 = new ratehelpers_1.FraRateHelper().frahInit1(h3x6, 3, 6, fixingDays, calendar, convention, endOfMonth, fraDayCounter);
    var fra6x9 = new ratehelpers_1.FraRateHelper().frahInit1(h6x9, 6, 9, fixingDays, calendar, convention, endOfMonth, fraDayCounter);
    var fra9x12 = new ratehelpers_1.FraRateHelper().frahInit1(h9x12, 9, 12, fixingDays, calendar, convention, endOfMonth, fraDayCounter);
    var termStructureDayCounter = new actualactual_1.ActualActual(actualactual_1.ActualActual.Convention.ISDA);
    var tolerance = 1.0e-15;
    var fraInstruments = [
        fra1x4,
        fra2x5,
        fra3x6,
        fra6x9,
        fra9x12
    ];
    var fraTermStructure = new piecewiseyieldcurve_1.PiecewiseYieldCurve(new bootstraptraits_1.Discount(), new loginterpolation_1.LogLinear())
        .pwycInit2(settlementDate, fraInstruments, termStructureDayCounter, tolerance);
    var discountingTermStructure = new handle_1.RelinkableHandle();
    discountingTermStructure.linkTo(fraTermStructure);
    var fraCalendar = euribor3m.fixingCalendar();
    var fraBusinessDayConvention = euribor3m.businessDayConvention();
    var fraFwdType = position_1.Position.Type.Long;
    var fraNotional = 100.0;
    var FraTermMonths = 3;
    var monthsToStart = [1, 2, 3, 6, 9];
    euriborTermStructure.linkTo(fraTermStructure);
    console.log('\nTest FRA construction, NPV calculation, and FRA purchase\n');
    var i = void 0;
    for (i = 0; i < monthsToStart.length; i++) {
        var fraValueDate = fraCalendar.advance1(settlementDate, monthsToStart[i], timeunit_1.TimeUnit.Months, fraBusinessDayConvention);
        var fraMaturityDate = fraCalendar.advance1(fraValueDate, FraTermMonths, timeunit_1.TimeUnit.Months, fraBusinessDayConvention);
        var fraStrikeRate = threeMonthFraQuote[monthsToStart[i]];
        var myFRA = new forwardrateagreement_1.ForwardRateAgreement(fraValueDate, fraMaturityDate, fraFwdType, fraStrikeRate, fraNotional, euribor3m, discountingTermStructure);
        console.log("\n                    3m Term FRA, Months to Start: " + monthsToStart[i] + "\n                    strike FRA rate: " + fraStrikeRate + "\n                    FRA 3m forward rate: " + myFRA.forwardRate() + "\n                    FRA market quote: " + threeMonthFraQuote[monthsToStart[i]] + "\n                    FRA spot value: " + myFRA.spotValue() + "\n                    FRA forward value: " + myFRA.forwardValue() + "\n                    FRA implied Yield: " + myFRA.impliedYield(myFRA.spotValue(), myFRA.forwardValue(), settlementDate, compounding_1.Compounding.Simple, fraDayCounter) + "\n                    market Zero Rate: " + discountingTermStructure.currentLink()
            .zeroRate1(fraMaturityDate, fraDayCounter, compounding_1.Compounding.Simple) + "\n                    FRA NPV [should be zero]: " + myFRA.NPV() + "\n                    ");
    }
    console.log('\nNow take a 100 basis-point upward shift in FRA quotes and examine NPV\n');
    var BpsShift = 0.01;
    threeMonthFraQuote[1] = 0.030 + BpsShift;
    threeMonthFraQuote[2] = 0.031 + BpsShift;
    threeMonthFraQuote[3] = 0.032 + BpsShift;
    threeMonthFraQuote[6] = 0.033 + BpsShift;
    threeMonthFraQuote[9] = 0.034 + BpsShift;
    fra1x4Rate.setValue(threeMonthFraQuote[1]);
    fra2x5Rate.setValue(threeMonthFraQuote[2]);
    fra3x6Rate.setValue(threeMonthFraQuote[3]);
    fra6x9Rate.setValue(threeMonthFraQuote[6]);
    fra9x12Rate.setValue(threeMonthFraQuote[9]);
    for (i = 0; i < monthsToStart.length; i++) {
        var fraValueDate = fraCalendar.advance1(settlementDate, monthsToStart[i], timeunit_1.TimeUnit.Months, fraBusinessDayConvention);
        var fraMaturityDate = fraCalendar.advance1(fraValueDate, FraTermMonths, timeunit_1.TimeUnit.Months, fraBusinessDayConvention);
        var fraStrikeRate = threeMonthFraQuote[monthsToStart[i]] - BpsShift;
        var myFRA = new forwardrateagreement_1.ForwardRateAgreement(fraValueDate, fraMaturityDate, fraFwdType, fraStrikeRate, fraNotional, euribor3m, discountingTermStructure);
        console.log("\n                    3m Term FRA, 100 notional, Months to Start = " + monthsToStart[i] + "\n                    strike FRA rate: " + fraStrikeRate + "\n                    FRA 3m forward rate: " + myFRA.forwardRate() + "\n                    FRA market quote: " + threeMonthFraQuote[monthsToStart[i]] + "\n                    FRA spot value: " + myFRA.spotValue() + "\n                    FRA forward value: " + myFRA.forwardValue() + "\n                    FRA implied Yield: " + myFRA.impliedYield(myFRA.spotValue(), myFRA.forwardValue(), settlementDate, compounding_1.Compounding.Simple, fraDayCounter) + "\n                    market Zero Rate: " + discountingTermStructure.currentLink()
            .zeroRate1(fraMaturityDate, fraDayCounter, compounding_1.Compounding.Simple) + "\n                    FRA NPV [should be positive]: " + myFRA.NPV() + "\n                    ");
    }
    var endTime = new Date();
    console.log("\nRun completed in " + (endTime.valueOf() - startTime.valueOf()) / 1000 + " seconds\n");
}
catch (e) {
    console.log(e);
}
//# sourceMappingURL=fra.js.map