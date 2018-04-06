import {Integer, Rate, Real, Size} from '../src/types';
import {Settings} from '../src/settings';
import {Compounding} from '../src/compounding';
import {Position} from '../src/position';
import {BusinessDayConvention} from '../src/time/businessdayconvention';
import {Calendar} from '../src/time/calendar';
import {Month} from '../src/time/date';
import {DayCounter} from '../src/time/daycounter';
import {TimeUnit} from '../src/time/timeunit';
import {ActualActual} from '../src/time/daycounters/actualactual';
import {RelinkableHandle} from '../src/handle';
import {Quote} from '../src/quote';
import {SimpleQuote} from '../src/quotes/simplequote';
import {Euribor3M} from '../src/indexes/ibor/euribor';
import {IborIndex} from '../src/indexes/iborindex';
import {LogLinear} from '../src/math/interpolations/loginterpolation';
import {YieldTermStructure} from '../src/termstructures/yieldtermstructure';
import {PiecewiseYieldCurve} from '../src/termstructures/yield/piecewiseyieldcurve';
import {RateHelper, FraRateHelper} from '../src/termstructures/yield/ratehelpers';
import {ForwardRateAgreement} from '../src/instruments/forwardrateagreement';
import {Discount} from '../src/termstructures/yield/bootstraptraits';



try {

    let startTime: Date = new Date();

    /*********************
     ***  MARKET DATA  ***
     *********************/

    let euriborTermStructure: RelinkableHandle<YieldTermStructure>
      = new RelinkableHandle<YieldTermStructure>(
          new YieldTermStructure());
    let euribor3m: IborIndex = new Euribor3M(euriborTermStructure);

    let todaysDate: Date = new Date(2006, Month.May - 1, 23);
    Settings.evaluationDate = new Settings.DateProxy(todaysDate);

    let calendar: Calendar = euribor3m.fixingCalendar();
    let fixingDays: Integer = euribor3m.fixingDays();
    let settlementDate: Date = calendar.advance1(todaysDate, fixingDays, TimeUnit.Days);

    console.log(`Today: ${todaysDate}`);

    console.log(`Settlement date: ${settlementDate}`);


    // 3 month term FRA quotes (index refers to monthsToStart)
    let threeMonthFraQuote: Array<Rate> = new Array<Rate>(10);

    threeMonthFraQuote[1]=0.030;
    threeMonthFraQuote[2]=0.031;
    threeMonthFraQuote[3]=0.032;
    threeMonthFraQuote[6]=0.033;
    threeMonthFraQuote[9]=0.034;

    /********************
     ***    QUOTES    ***
     ********************/

    // SimpleQuote stores a value which can be manually changed;
    // other Quote subclasses could read the value from a database
    // or some kind of data feed.


    // FRAs
    let fra1x4Rate: SimpleQuote
      = new SimpleQuote(threeMonthFraQuote[1]);
    let fra2x5Rate: SimpleQuote
      = new SimpleQuote(threeMonthFraQuote[2]);
    let fra3x6Rate: SimpleQuote
      = new SimpleQuote(threeMonthFraQuote[3]);
    let fra6x9Rate: SimpleQuote
      = new SimpleQuote(threeMonthFraQuote[6]);
    let fra9x12Rate: SimpleQuote
      = new SimpleQuote(threeMonthFraQuote[9]);

    let h1x4: RelinkableHandle<Quote>
      = new RelinkableHandle<Quote>();
    h1x4.linkTo(fra1x4Rate);
    let h2x5: RelinkableHandle<Quote>
      = new RelinkableHandle<Quote>();
    h2x5.linkTo(fra2x5Rate);
    let h3x6: RelinkableHandle<Quote>
      = new RelinkableHandle<Quote>();
    h3x6.linkTo(fra3x6Rate);
    let h6x9: RelinkableHandle<Quote>
      = new RelinkableHandle<Quote>();
    h6x9.linkTo(fra6x9Rate);
    let h9x12: RelinkableHandle<Quote>
      = new RelinkableHandle<Quote>();
    h9x12.linkTo(fra9x12Rate);

    /*********************
     ***  RATE HELPERS ***
     *********************/

    // RateHelpers are built from the above quotes together with
    // other instrument dependant infos.  Quotes are passed in
    // relinkable handles which could be relinked to some other
    // data source later.

    let fraDayCounter: DayCounter = euribor3m.dayCounter();
    let convention: BusinessDayConvention = euribor3m.businessDayConvention();
    let endOfMonth: boolean = euribor3m.endOfMonth();

    let fra1x4: FraRateHelper
      = new FraRateHelper().frahInit1(h1x4, 1, 4,
                     fixingDays, calendar, convention,
                     endOfMonth, fraDayCounter);

    let fra2x5: FraRateHelper
      = new FraRateHelper().frahInit1(h2x5, 2, 5,
                     fixingDays, calendar, convention,
                     endOfMonth, fraDayCounter);

    let fra3x6: FraRateHelper
      = new FraRateHelper().frahInit1(h3x6, 3, 6,
                     fixingDays, calendar, convention,
                     endOfMonth, fraDayCounter);

    let fra6x9: FraRateHelper
      = new FraRateHelper().frahInit1(h6x9, 6, 9,
                     fixingDays, calendar, convention,
                     endOfMonth, fraDayCounter);

    let fra9x12: FraRateHelper
      = new FraRateHelper().frahInit1(h9x12, 9, 12,
                      fixingDays, calendar, convention,
                      endOfMonth, fraDayCounter);


    /*********************
     **  CURVE BUILDING **
     *********************/

    // Any DayCounter would be fine.
    // ActualActual::ISDA ensures that 30 years is 30.0
    let termStructureDayCounter: DayCounter =
        new ActualActual(ActualActual.Convention.ISDA);

    let tolerance: Real = 1.0e-15;

    // A FRA curve
    let fraInstruments: Array<RateHelper> = [
      fra1x4,
      fra2x5,
      fra3x6,
      fra6x9,
      fra9x12
    ];

    let fraTermStructure: PiecewiseYieldCurve
      = new PiecewiseYieldCurve(new Discount(),
                                new LogLinear())
            .pwycInit2(settlementDate,
                       fraInstruments,
                       termStructureDayCounter,
                       tolerance);


    // Term structures used for pricing/discounting

    let discountingTermStructure: RelinkableHandle<YieldTermStructure>
      = new RelinkableHandle<YieldTermStructure>();
    discountingTermStructure.linkTo(fraTermStructure);


    /***********************
     ***  construct FRA's ***
     ***********************/

    let fraCalendar: Calendar = euribor3m.fixingCalendar();
    let fraBusinessDayConvention: BusinessDayConvention =
        euribor3m.businessDayConvention();
    let fraFwdType: Position.Type = Position.Type.Long;
    let fraNotional: Real = 100.0;
    const FraTermMonths: Integer = 3;
    let monthsToStart: Array<Integer> = [ 1, 2, 3, 6, 9 ];

    euriborTermStructure.linkTo(fraTermStructure);

    console.log('\nTest FRA construction, NPV calculation, and FRA purchase\n');

    let i: Size;
    for (i=0; i<monthsToStart.length; i++) {

        let fraValueDate: Date = fraCalendar.advance1(
                                   settlementDate,monthsToStart[i], TimeUnit.Months,
                                   fraBusinessDayConvention);

        let fraMaturityDate: Date = fraCalendar.advance1(
                                        fraValueDate,FraTermMonths,TimeUnit.Months,
                                        fraBusinessDayConvention);

        let fraStrikeRate: Rate = threeMonthFraQuote[monthsToStart[i]];

        let myFRA: ForwardRateAgreement =
          new ForwardRateAgreement(fraValueDate, fraMaturityDate,
                                   fraFwdType,fraStrikeRate,
                                   fraNotional, euribor3m,
                                   discountingTermStructure);

        console.log(`
                    3m Term FRA, Months to Start: ${monthsToStart[i]}
                    strike FRA rate: ${fraStrikeRate}
                    FRA 3m forward rate: ${myFRA.forwardRate()}
                    FRA market quote: ${threeMonthFraQuote[monthsToStart[i]]}
                    FRA spot value: ${myFRA.spotValue()}
                    FRA forward value: ${myFRA.forwardValue()}
                    FRA implied Yield: ${myFRA.impliedYield(myFRA.spotValue(),
                                                            myFRA.forwardValue(),
                                                            settlementDate,
                                                            Compounding.Simple,
                                                            fraDayCounter)}
                    market Zero Rate: ${discountingTermStructure.currentLink()
                                              .zeroRate1(fraMaturityDate,
                                                       fraDayCounter,
                                                       Compounding.Simple)}
                    FRA NPV [should be zero]: ${myFRA.NPV()}
                    `);

    }





    console.log('\nNow take a 100 basis-point upward shift in FRA quotes and examine NPV\n');

    const BpsShift: Real = 0.01;

    threeMonthFraQuote[1]=0.030+BpsShift;
    threeMonthFraQuote[2]=0.031+BpsShift;
    threeMonthFraQuote[3]=0.032+BpsShift;
    threeMonthFraQuote[6]=0.033+BpsShift;
    threeMonthFraQuote[9]=0.034+BpsShift;

    fra1x4Rate.setValue(threeMonthFraQuote[1]);
    fra2x5Rate.setValue(threeMonthFraQuote[2]);
    fra3x6Rate.setValue(threeMonthFraQuote[3]);
    fra6x9Rate.setValue(threeMonthFraQuote[6]);
    fra9x12Rate.setValue(threeMonthFraQuote[9]);


    for (i=0; i<monthsToStart.length; i++) {

        let fraValueDate: Date = fraCalendar.advance1(
                                   settlementDate,monthsToStart[i], TimeUnit.Months,
                                   fraBusinessDayConvention);

        let fraMaturityDate: Date = fraCalendar.advance1(
                                        fraValueDate,FraTermMonths, TimeUnit.Months,
                                        fraBusinessDayConvention);

        let fraStrikeRate: Rate =
            threeMonthFraQuote[monthsToStart[i]] - BpsShift;

        let myFRA: ForwardRateAgreement =
          new ForwardRateAgreement(fraValueDate, fraMaturityDate,
                                   fraFwdType, fraStrikeRate,
                                   fraNotional, euribor3m,
                                   discountingTermStructure);

        console.log(`
                    3m Term FRA, 100 notional, Months to Start = ${monthsToStart[i]}
                    strike FRA rate: ${fraStrikeRate}
                    FRA 3m forward rate: ${myFRA.forwardRate()}
                    FRA market quote: ${threeMonthFraQuote[monthsToStart[i]]}
                    FRA spot value: ${myFRA.spotValue()}
                    FRA forward value: ${myFRA.forwardValue()}
                    FRA implied Yield: ${myFRA.impliedYield(myFRA.spotValue(),
                                                            myFRA.forwardValue(),
                                                            settlementDate,
                                                            Compounding.Simple,
                                                            fraDayCounter)}
                    market Zero Rate: ${discountingTermStructure.currentLink()
                                             .zeroRate1(fraMaturityDate,
                                                        fraDayCounter,
                                                        Compounding.Simple)}
                    FRA NPV [should be positive]: ${myFRA.NPV()}
                    `);
    }

    let endTime: Date = new Date();

    console.log(`\nRun completed in ${(endTime.valueOf() - startTime.valueOf())/1000} seconds\n`);

} catch (e) {
    console.log(e);
}
