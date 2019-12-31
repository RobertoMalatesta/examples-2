/**
 * Copyright 2019 - 2020 Jin Yang. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { Actual360, Actual365Fixed, Array1D, BasketGeneratingEngine, BermudanExercise, BlackIborCouponPricer, BusinessDayConvention, ConstantSwaptionVolatility, DateExt, DateGeneration, DiscountingSwapEngine, EndCriteria, Euribor, EuriborSwapIsdaFixA, FlatForward, FloatFloatSwap, FloatFloatSwaption, Gaussian1dFloatFloatSwaptionEngine, Gaussian1dNonstandardSwaptionEngine, Gaussian1dSwaptionEngine, Gsr, Handle, LevenbergMarquardt, LinearTsrPricer, MarkovFunctional, NonstandardSwap, NonstandardSwaption, Period, QL_NULL_REAL, RebatedExercise, RelinkableHandle, Schedule, setCouponPricer, Settings, SimpleQuote, TARGET, Thirty360, TimeUnit, VanillaSwap, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

function printBasket(basket) {
    for (let j = 0; j < basket.length; ++j) {
        const helper = basket[j];
        const endDate = Array1D.back(helper.underlyingSwap().fixedSchedule().dates());
        const nominal = helper.underlyingSwap().nominal();
        const vol = helper.volatility().currentLink().value();
        const rate = helper.underlyingSwap().fixedRate();
        const expiry = helper.swaption().exercise().date(0);
        const type = helper.swaption().type();
        print('Expiry              Maturity            Nominal             Rate          Pay/Rec     Market ivol');
        print('==================================================================================================');
        print(`${expiry.toDateString()}` +
            `${endDate.toDateString()}`+
            `${nominal.toFixed(6).toString().padStart(8, ' ')} ` +
            `${rate.toFixed(6).toString().padStart(8, ' ')} ` +
            `${(type === VanillaSwap.Type.Payer ? 'Payer' : 'Receiver')}` +
            `${vol.toFixed(6).toString().padStart(8, ' ')}`);
    }
}

function printModelCalibration(basket, volatility) {
    print('Expiry              Model sigma   Model price         market price        Model ivol    Market ivol');
    print('====================================================================================================');
    for (let j = 0; j < basket.length; ++j) {
        const helper = basket[j];
        const expiry = helper.swaption().exercise().date(0);
        print(`${expiry.toDateString()} ` +
            `${volatility[j]} ${basket[j].modelValue()} ` +
            `${basket[j].marketValue()} ` +
            `${basket[j].impliedVolatility(basket[j].modelValue(), 1E-6, 1000, 0.0, 2.0)} ` +
            `${basket[j].volatility().currentLink().value()}`);
    }
    if (volatility.length > basket.length) {
        print(`${Array1D.back(volatility)}`);
    }
}

describe(`gaussian 1d models example ${version}`, () => {

    print('This is some example code showing how to use the GSR ');
    print('(Gaussian short rate) and Markov Functional model.');
    print('  ');
    const refDate = DateExt.UTC('30,April,2014');
    Settings.evaluationDate.set(refDate);
    print('The evaluation date for this example is set to ' +
        `${Settings.evaluationDate.f().toDateString()}`);
    print('  ');
    const forward6mLevel = 0.025;
    const oisLevel = 0.02;
    const forward6mQuote = new Handle(new SimpleQuote(forward6mLevel));
    const oisQuote = new Handle(new SimpleQuote(oisLevel));
    const yts6m = new Handle(new FlatForward().ffInit3(0, new TARGET(), forward6mQuote, new Actual365Fixed()));
    const ytsOis = new Handle(new FlatForward().ffInit3(0, new TARGET(), oisQuote, new Actual365Fixed()));
    const euribor6m = new Euribor(new Period().init1(6, TimeUnit.Months), yts6m);
    print('We assume a multicurve setup, for simplicity with flat yield ');
    print('term structures. The discounting curve is an Eonia curve at');
    print(`a level of ${oisLevel} and the forwarding curve is an Euribior 6m curve`);
    print(`at a level of ${forward6mLevel}`);
    print('  ');
    const volLevel = 0.20;
    const volQuote = new Handle(new SimpleQuote(volLevel));
    const swaptionVol = new Handle(new ConstantSwaptionVolatility().csvInit1(0, new TARGET(), BusinessDayConvention.ModifiedFollowing, volQuote, new Actual365Fixed()));
    print(`For the volatility we assume a flat swaption volatility at ${volLevel}`);
    print('  ');
    const strike = 0.04;
    print('We consider a standard 10y bermudan payer swaption ');
    print(`with yearly exercises at a strike of ${strike}`);
    print('  ');
    const effectiveDate = new TARGET().advance1(refDate, 2, TimeUnit.Days);
    const maturityDate = new TARGET().advance1(effectiveDate, 10, TimeUnit.Years);
    const fixedSchedule = new Schedule().init2(effectiveDate, maturityDate, new Period().init1(1, TimeUnit.Years), new TARGET(), BusinessDayConvention.ModifiedFollowing, BusinessDayConvention.ModifiedFollowing, DateGeneration.Rule.Forward, false);
    const floatingSchedule = new Schedule().init2(effectiveDate, maturityDate, new Period().init1(6, TimeUnit.Months), new TARGET(), BusinessDayConvention.ModifiedFollowing, BusinessDayConvention.ModifiedFollowing, DateGeneration.Rule.Forward, false);
    const underlying = new NonstandardSwap().nssInit1(new VanillaSwap(VanillaSwap.Type.Payer, 1.0, fixedSchedule, strike, new Thirty360(), floatingSchedule, euribor6m, 0.00, new Actual360()));
    const exerciseDates = [];
    for (let i = 1; i < 10; ++i) {
        exerciseDates.push(new TARGET().advance1(fixedSchedule.date(i), -2, TimeUnit.Days));
    }
    const exercise = new BermudanExercise().beInit(exerciseDates, false);
    const swaption = new NonstandardSwaption().nssInit2(underlying, exercise);
    print('The model is a one factor Hull White model with piecewise ');
    print('volatility adapted to our exercise dates.');
    print('  ');
    const stepDates = exerciseDates.slice(0, exerciseDates.length - 1);
    const sigmas = Array1D.fromSizeValue(stepDates.length + 1, 0.01);
    const reversion = 0.01;
    print(`The reversion is just kept constant at a level of ${reversion}`);
    print('  ');
    print('The model\'s curve is set to the 6m forward curve. Note that ');
    print('the model adapts automatically to other curves where appropriate ');
    print('(e.g. if an index requires a different forwarding curve) or ');
    print('where explicitly specified (e.g. in a swaption pricing engine).');
    print('  ');
    const gsr = new Gsr().gsrInit1(yts6m, stepDates, sigmas, reversion);
    const swaptionEngine = new Gaussian1dSwaptionEngine().g1dseInit1(gsr, 64, 7.0, true, false, ytsOis);
    const nonstandardSwaptionEngine = new Gaussian1dNonstandardSwaptionEngine().g1dnsseInit1(gsr, 64, 7.0, true, false, new Handle(), ytsOis);
    swaption.setPricingEngine(nonstandardSwaptionEngine);
    print('The engine can generate a calibration basket in two modes.');
    print('The first one is called Naive and generates ATM swaptions adapted to');
    print('the exercise dates of the swaption and its maturity date');
    print('The resulting basket looks as follows:');
    print('  ');
    const swapBase = new EuriborSwapIsdaFixA().esInit2(new Period().init1(10, TimeUnit.Years), yts6m, ytsOis);
    let t1 = Date.now();
    let basket = swaption.calibrationBasket(swapBase, swaptionVol.currentLink(), BasketGeneratingEngine.CalibrationBasketType.Naive);
    let t2 = Date.now();
    printBasket(basket);
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('Let\'s calibrate our model to this basket. We use a specialized');
    print('calibration method calibrating the sigma function one by one to');
    print('the calibrating vanilla swaptions. The result of this is as follows:');
    print('  ');
    for (let i = 0; i < basket.length; ++i) {
        basket[i].setPricingEngine(swaptionEngine);
    }
    const method = new LevenbergMarquardt();
    const ec = new EndCriteria(1000, 10, 1E-8, 1E-8, 1E-8);
    t1 = Date.now();
    gsr.calibrateVolatilitiesIterative(basket, method, ec);
    t2 = Date.now();
    printModelCalibration(basket, gsr.volatility());
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('Finally we price our bermudan swaption in the calibrated model:');
    t1 = Date.now();
    let npv = swaption.NPV();
    t2 = Date.now();
    print('  ');
    print(`Bermudan swaption NPV (ATM calibrated GSR) = ${npv}`);
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('There is another mode to generate a calibration basket called');
    print('MaturityStrikeByDeltaGamma. This means that the maturity, ');
    print('the strike and the nominal of the calibrating swaption are ');
    print('computed such that the npv and its first and second ');
    print('derivative with respect to the model\'s state variable) of');
    print('the exotics underlying match with the calibrating swaption\'s');
    print('underlying. Let\'s try this in our case.');
    print('  ');
    t1 = Date.now();
    basket = swaption.calibrationBasket(swapBase, swaptionVol.currentLink(), BasketGeneratingEngine.CalibrationBasketType.MaturityStrikeByDeltaGamma);
    t2 = Date.now();
    printBasket(basket);
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('The calibrated nominal is close to the exotics nominal.');
    print('The expiries and maturity dates of the vanillas are the same');
    print('as in the case above. The difference is the strike which');
    print('is now equal to the exotics strike.');
    print('  ');
    print('Let\'s see how this affects the exotics npv. The ');
    print('recalibrated model is:');
    print('  ');
    for (let i = 0; i < basket.length; ++i) {
        basket[i].setPricingEngine(swaptionEngine);
    }
    t1 = Date.now();
    gsr.calibrateVolatilitiesIterative(basket, method, ec);
    t2 = Date.now();
    printModelCalibration(basket, gsr.volatility());
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('And the bermudan\'s price becomes:');
    print('  ');
    t1 = Date.now();
    npv = swaption.NPV();
    t2 = Date.now();
    print(`Bermudan swaption NPV (deal strike calibrated GSR) = ${npv}`);
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('We can do more complicated things, let\'s e.g. modify the');
    print('nominal schedule to be linear amortizing and see what');
    print('the effect on the generated calibration basket is:');
    print('  ');
    const nominalFixed = [], nominalFloating = [];
    for (let i = 0; i < fixedSchedule.size() - 1; ++i) {
        const tmpNom = 1.0 - i / (fixedSchedule.size() - 1);
        nominalFixed.push(tmpNom);
        nominalFloating.push(tmpNom);
        nominalFloating.push(tmpNom);
    }
    const strikes = Array1D.fromSizeValue(nominalFixed.length, strike);
    const underlying2 = new NonstandardSwap().nssInit2(VanillaSwap.Type.Payer, nominalFixed, nominalFloating, fixedSchedule, strikes, new Thirty360(), floatingSchedule, euribor6m, 1.0, 0.0, new Actual360());
    const swaption2 = new NonstandardSwaption().nssInit2(underlying2, exercise);
    swaption2.setPricingEngine(nonstandardSwaptionEngine);
    t1 = Date.now();
    basket = swaption2.calibrationBasket(swapBase, swaptionVol.currentLink(), BasketGeneratingEngine.CalibrationBasketType.MaturityStrikeByDeltaGamma);
    t2 = Date.now();
    printBasket(basket);
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('The notional is weighted over the underlying exercised ');
    print('into and the maturity is adjusted downwards. The rate');
    print('on the other hand is not affected.');
    print('  ');
    print('You can also price exotic bond\'s features. If you have e.g. a');
    print('bermudan callable fixed bond you can set up the call right ')
    print('as a swaption to enter into a one leg swap with notional');
    print('reimbursement at maturity.');
    print('The exercise should then be written as a rebated exercise');
    print('paying the notional in case of exercise.');
    print('  ');
    print('The calibration basket looks like this:');
    print('  ');
    const nominalFixed2 = Array1D.fromSizeValue(nominalFixed.length, 1.0);
    const nominalFloating2 = Array1D.fromSizeValue(nominalFloating.length, 0.0);
    const underlying3 = new NonstandardSwap().nssInit2(VanillaSwap.Type.Receiver, nominalFixed2, nominalFloating2, fixedSchedule, strikes, new Thirty360(), floatingSchedule, euribor6m, 1.0, 0.0, new Actual360(), false, true);
    const exercise2 = new RebatedExercise().reInit1(exercise, -1.0, 2, new TARGET());
    const swaption3 = new NonstandardSwaption().nssInit2(underlying3, exercise2);
    const oas0 = new SimpleQuote(0.0);
    const oas100 = new SimpleQuote(0.01);
    const oas = new RelinkableHandle(oas0);
    const nonstandardSwaptionEngine2 = new Gaussian1dNonstandardSwaptionEngine().g1dnsseInit1(gsr, 64, 7.0, true, false, oas);
    swaption3.setPricingEngine(nonstandardSwaptionEngine2);
    t1 = Date.now();
    basket = swaption3.calibrationBasket(swapBase, swaptionVol.currentLink(), BasketGeneratingEngine.CalibrationBasketType.MaturityStrikeByDeltaGamma);
    t2 = Date.now();
    printBasket(basket);
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('Note that nominals are not exactly 1.0 here. This is');
    print('because we do our bond discounting on 6m level while');
    print('the swaptions are still discounted on OIS level.');
    print('(You can try this by changing the OIS level to the ');
    print('6m level, which will produce nominals near 1.0).');
    print('The npv of the call right is (after recalibrating the model)');
    for (let i = 0; i < basket.length; i++) {
        basket[i].setPricingEngine(swaptionEngine);
    }
    t1 = Date.now();
    gsr.calibrateVolatilitiesIterative(basket, method, ec);
    const npv3 = swaption3.NPV();
    t2 = Date.now();
    print('  ');
    print(`Bond\'s bermudan call right npv = ${npv3}`);
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('Up to now, no credit spread is included in the pricing.');
    print('We can do so by specifying an oas in the pricing engine.');
    print('Let\'s set the spread level to 100bp and regenerate');
    print('the calibration basket.');
    print('  ');
    oas.linkTo(oas100);
    t1 = Date.now();
    basket = swaption3.calibrationBasket(swapBase, swaptionVol.currentLink(), BasketGeneratingEngine.CalibrationBasketType.MaturityStrikeByDeltaGamma);
    t2 = Date.now();
    printBasket(basket);
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('The adjusted basket takes the credit spread into account.');
    print('This is consistent to a hedge where you would have a');
    print('margin on the float leg around 100bp,too.');
    print('  ');
    print('The npv becomes:');
    print('  ');
    for (let i = 0; i < basket.length; i++) {
        basket[i].setPricingEngine(swaptionEngine);
    }
    t1 = Date.now();
    gsr.calibrateVolatilitiesIterative(basket, method, ec);
    const npv4 = swaption3.NPV();
    t2 = Date.now();
    print(`Bond\'s bermudan call right npv (oas = 100bp) = ${npv4}`);
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('The next instrument we look at is a CMS 10Y vs Euribor ');
    print('6M swaption. The maturity is again 10 years and the option');
    print('is exercisable on a yearly basis');
    print('  ');
    const underlying4 = new FloatFloatSwap().ffsInit1(VanillaSwap.Type.Payer, 1.0, 1.0, fixedSchedule, swapBase, new Thirty360(), floatingSchedule, euribor6m, new Actual360(), false, false, 1.0, 0.0, QL_NULL_REAL, QL_NULL_REAL, 1.0, 0.0010);
    const swaption4 = new FloatFloatSwaption(underlying4, exercise);
    const floatSwaptionEngine = new Gaussian1dFloatFloatSwaptionEngine().g1dffseInit1(gsr, 64, 7.0, true, false, new Handle(), ytsOis, true);
    swaption4.setPricingEngine(floatSwaptionEngine);
    print('Since the underlying is quite exotic already, we start with');
    print('pricing this using the LinearTsrPricer for CMS coupon estimation');
    const reversionQuote = new Handle(new SimpleQuote(reversion));
    const leg0 = underlying4.leg(0);
    const leg1 = underlying4.leg(1);
    const cmsPricer = new LinearTsrPricer(swaptionVol, reversionQuote);
    const iborPricer = new BlackIborCouponPricer();
    setCouponPricer(leg0, cmsPricer);
    setCouponPricer(leg1, iborPricer);
    const swapPricer = new DiscountingSwapEngine(ytsOis);
    underlying4.setPricingEngine(swapPricer);
    t1 = Date.now();
    const npv5 = underlying4.NPV();
    t2 = Date.now();
    print(`Underlying CMS Swap NPV = ${npv5}`);
    print(`       CMS     Leg  NPV = ${underlying4.legNPV(0)}`);
    print(`       Euribor Leg  NPV = ${underlying4.legNPV(1)}`);
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('We generate a naive calibration basket and calibrate ');
    print('the GSR model to it:');
    print('  ');
    t1 = Date.now();
    basket = swaption4.calibrationBasket(swapBase, swaptionVol.currentLink(), BasketGeneratingEngine.CalibrationBasketType.Naive);
    for (let i = 0; i < basket.length; ++i) {
        basket[i].setPricingEngine(swaptionEngine);
    }
    gsr.calibrateVolatilitiesIterative(basket, method, ec);
    t2 = Date.now();
    printBasket(basket);
    printModelCalibration(basket, gsr.volatility());
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('The npv of the bermudan swaption is');
    t1 = Date.now();
    const npv6 = swaption4.NPV();
    t2 = Date.now();
    print(`Float swaption NPV (GSR) = ${npv6}`);
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('In this case it is also interesting to look at the ');
    print('underlying swap npv in the GSR model.');
    print('  ');
    print('Float swap NPV (GSR) = ' +
        `${swaption4.result('underlyingValue')}`);
    print('  ');
    print('Not surprisingly, the underlying is priced differently');
    print('compared to the LinearTsrPricer, since a different');
    print('smile is implied by the GSR model.');
    print('  ');
    print('This is exactly where the Markov functional model');
    print('comes into play, because it can calibrate to any');
    print('given underlying smile (as long as it is arbitrage');
    print('free). We try this now. Of course the usual use case');
    print('is not to calibrate to a flat smile as in our simple');
    print('example, still it should be possible, of course...');
    print('  ');
    const markovStepDates = Array.from(exerciseDates);
    const cmsFixingDates = Array.from(markovStepDates);
    const markovSigmas = Array1D.fromSizeValue(markovStepDates.length + 1, 0.01);
    const tenors = new Array(cmsFixingDates.length);
    for (let i = 0; i < tenors.length; i++) {
        tenors[i] = new Period().init1(10, TimeUnit.Years);
    }
    const markov = new MarkovFunctional().mfInit1(yts6m, reversion, markovStepDates, markovSigmas, swaptionVol, cmsFixingDates, tenors, swapBase, new MarkovFunctional.ModelSettings().withYGridPoints(16));
    const swaptionEngineMarkov = new Gaussian1dSwaptionEngine().g1dseInit1(markov, 8, 5.0, true, false, ytsOis);
    const floatEngineMarkov = new Gaussian1dFloatFloatSwaptionEngine().g1dffseInit1(markov, 16, 7.0, true, false, new Handle(), ytsOis, true);
    swaption4.setPricingEngine(floatEngineMarkov);
    t1 = Date.now();
    const npv7 = swaption4.NPV();
    t2 = Date.now();
    print('The option npv is the markov model is:');
    print('  ');
    print(`Float swaption NPV (Markov) = ${npv7}`);
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('This is not too far from the GSR price.');
    print('  ');
    print('More interesting is the question how well the Markov');
    print('model did its job to match our input smile. For this');
    print('we look at the underlying npv under the Markov model');
    print('  ');
    print(`Float swap NPV (Markov) = ${swaption4.result('underlyingValue')}`);
    print('  ');
    print('This is closer to our terminal swap rate model price.');
    print('A perfect match is not expected anyway, because the');
    print('dynamics of the underlying rate in the linear');
    print('model is different from the Markov model, of course.');
    print('  ');
    print('The Markov model can not only calibrate to the');
    print('\nunderlying smile, but has at the same time a');
    print('\nsigma function (similar to the GSR model) which');
    print('\ncan be used to calibrate to a second instrument');
    print('\nset. We do this here to calibrate to our coterminal');
    print('\nATM swaptions from above.');
    print('  ');
    print('This is a computationally demanding task, so');
    print('depending on your machine, this may take a ');
    print('while now...');
    print('  ');
    for (let i = 0; i < basket.length; ++i) {
        basket[i].setPricingEngine(swaptionEngineMarkov);
    }
    t1 = Date.now();
    markov.calibrate(basket, method, ec);
    t2 = Date.now();
    printModelCalibration(basket, markov.volatility());
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('Now let\'s have a look again at the underlying pricing.');
    print('It shouldn\'t have changed much, because the underlying');
    print('smile is still matched.');
    print('  ');
    t1 = Date.now();
    const npv8 = swaption4.result('underlyingValue');
    t2 = Date.now();
    print(`Float swap NPV (Markov) = ${npv8}`);
    print('  ');
    print(`this step took ${(t2 - t1) / 1000} seconds`);
    print('  ');
    print('This is close to the previous value as expected.');
    print('  ');
    print('As a final remark we note that the calibration to');
    print('coterminal swaptions is not particularly reasonable');
    print('here, because the european call rights are not');
    print('well represented by these swaptions.');
    print('Secondly, our CMS swaption is sensitive to the');
    print('correlation between the 10y swap rate and the');
    print('Euribor 6M rate. Since the Markov model is one factor');
    print('it will most probably underestimate the market value');
    print('by construction.');
    print('  ');
    print('That was it. Thank you for running this demo. Bye.');

});
