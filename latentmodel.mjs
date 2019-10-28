import { Actual365Fixed, Array1D, Basket, ConstantRecoveryModel, EURCurrency, FlatHazardRate, GaussianCopulaPolicy, GaussianDefProbLM, Handle, Issuer, LatentModelIntegrationType, NorthAmericaCorpDefaultKey, Period, Pool, RandomDefaultLM, Seniority, Settings, TARGET, TCopulaPolicy, TDefProbLM, TimeUnit, version } from 'https://cdn.jsdelivr.net/npm/@quantlib/ql@latest/ql.mjs';

describe(`latent model example ${version}`, () => {
    
    const calendar = new TARGET();
    let todaysDate = new Date('19-March-2014');
    todaysDate = calendar.adjust(todaysDate);
    Settings.evaluationDate.set(todaysDate);
    const hazardRates = Array1D.fromSizeValue(3, -Math.log(1. - 0.01));
    const names = [];
    for (let i = 0; i < hazardRates.length; i++) {
        names.push(`Acme ${i}`);
    }
    const defTS = [];
    for (let i = 0; i < hazardRates.length; i++) {
        defTS.push(new Handle(new FlatHazardRate().fhrInit4(0, new TARGET(), hazardRates[i], new Actual365Fixed())));
    }
    const issuers = [];
    for (let i = 0; i < hazardRates.length; i++) {
        const curves = [[
                new NorthAmericaCorpDefaultKey(new EURCurrency(), Seniority.SeniorSec, new Period(), 1.),
                defTS[i]
            ]];
        issuers.push(new Issuer().init1(curves));
    }
    const thePool = new Pool();
    for (let i = 0; i < hazardRates.length; i++) {
        thePool.add(names[i], issuers[i], new NorthAmericaCorpDefaultKey(new EURCurrency(), Seniority.SeniorSec, new Period(), 1.));
    }
    const defaultKeys = new Array(hazardRates.length);
    for (let i = 0; i < defaultKeys.length; i++) {
        defaultKeys[i] = new NorthAmericaCorpDefaultKey(new EURCurrency(), Seniority.SeniorSec, new Period(), 1.);
    }
    const rrModels = new Array(hazardRates.length);
    for (let i = 0; i < rrModels.length; i++) {
        rrModels[i] =
            new ConstantRecoveryModel().crmInit2(0.5, Seniority.SeniorSec);
    }
    const theBskt = new Basket().init(todaysDate, names, Array1D.fromSizeValue(hazardRates.length, 100.), thePool);
    const fctrsWeights = new Array(hazardRates.length);
    for (let i = 0; i < fctrsWeights.length; i++) {
        fctrsWeights[i] = [Math.sqrt(0.1)];
    }
    const lmG = new GaussianDefProbLM().dlmInit1(fctrsWeights, LatentModelIntegrationType.GaussianQuadrature, null);
    const ordersT = [3, 3];
    const iniT = {};
    iniT.tOrders = ordersT;
    const lmT = new TDefProbLM().dlmInit1(fctrsWeights, LatentModelIntegrationType.Trapezoid, iniT);
    const numSimulations = 100000;
    const rdlmG = new RandomDefaultLM(new GaussianCopulaPolicy())
        .init1(lmG, [], numSimulations, 1.e-6, 2863311530);
    const rdlmT = new RandomDefaultLM(new TCopulaPolicy())
        .init1(lmT, [], numSimulations, 1.e-6, 2863311530);
    const calcDate = new TARGET().advance1(Settings.evaluationDate.f(), 120, TimeUnit.Months);
    const probEventsTLatent = [], probEventsTRandLoss = [];
    const probEventsGLatent = [], probEventsGRandLoss = [];
    lmT.resetBasket(theBskt);
    for (let numEvts = 0; numEvts <= theBskt.size(); numEvts++) {
        probEventsTLatent.push(lmT.probAtLeastNEvents(numEvts, calcDate));
    }
    theBskt.setLossModel(rdlmT);
    for (let numEvts = 0; numEvts <= theBskt.size(); numEvts++) {
        probEventsTRandLoss.push(theBskt.probAtLeastNEvents(numEvts, calcDate));
    }
    lmG.resetBasket(theBskt);
    for (let numEvts = 0; numEvts <= theBskt.size(); numEvts++) {
        probEventsGLatent.push(lmG.probAtLeastNEvents(numEvts, calcDate));
    }
    theBskt.setLossModel(rdlmG);
    for (let numEvts = 0; numEvts <= theBskt.size(); numEvts++) {
        probEventsGRandLoss.push(theBskt.probAtLeastNEvents(numEvts, calcDate));
    }
    const correlDate = new TARGET().advance1(Settings.evaluationDate.f(), 12, TimeUnit.Months);
    const correlsGlm = [], correlsTlm = [], correlsGrand = [], correlsTrand = [];
    lmT.resetBasket(theBskt);
    for (let iName1 = 0; iName1 < theBskt.size(); iName1++) {
        const tmp = [];
        for (let iName2 = 0; iName2 < theBskt.size(); iName2++) {
            tmp.push(lmT.defaultCorrelation(correlDate, iName1, iName2));
        }
        correlsTlm.push(tmp);
    }
    theBskt.setLossModel(rdlmT);
    for (let iName1 = 0; iName1 < theBskt.size(); iName1++) {
        const tmp = [];
        for (let iName2 = 0; iName2 < theBskt.size(); iName2++) {
            tmp.push(theBskt.defaultCorrelation(correlDate, iName1, iName2));
        }
        correlsTrand.push(tmp);
    }
    lmG.resetBasket(theBskt);
    for (let iName1 = 0; iName1 < theBskt.size(); iName1++) {
        const tmp = [];
        for (let iName2 = 0; iName2 < theBskt.size(); iName2++) {
            tmp.push(lmG.defaultCorrelation(correlDate, iName1, iName2));
        }
        correlsGlm.push(tmp);
    }
    theBskt.setLossModel(rdlmG);
    for (let iName1 = 0; iName1 < theBskt.size(); iName1++) {
        const tmp = [];
        for (let iName2 = 0; iName2 < theBskt.size(); iName2++) {
            tmp.push(theBskt.defaultCorrelation(correlDate, iName1, iName2));
        }
        correlsGrand.push(tmp);
    }
    print('Gaussian versus T prob of extreme event (random and integrable)-');
    for (let numEvts = 0; numEvts <= theBskt.size(); numEvts++) {
        print(`-Prob of ${numEvts} events... ` +
            `${probEventsGLatent[numEvts]} ** ` +
            `${probEventsTLatent[numEvts]} ** ` +
            `${probEventsGRandLoss[numEvts]} ** ` +
            `${probEventsTRandLoss[numEvts]}`);
    }
    print('-- Default correlations G,T,GRand,TRand--');
    print('-----------------------------------------');
    for (let iName1 = 0; iName1 < theBskt.size(); iName1++) {
        for (let iName2 = 0; iName2 < theBskt.size(); iName2++) {
            print(`${correlsGlm[iName1][iName2]} , ` +
                ' , ');
        }
    }
    for (let iName1 = 0; iName1 < theBskt.size(); iName1++) {
        for (let iName2 = 0; iName2 < theBskt.size(); iName2++) {
            print(`${correlsTlm[iName1][iName2]} , `);
        }
    }
    for (let iName1 = 0; iName1 < theBskt.size(); iName1++) {
        for (let iName2 = 0; iName2 < theBskt.size(); iName2++) {
            print(`${correlsGrand[iName1][iName2]} , ` +
                ' , ');
        }
    }
    for (let iName1 = 0; iName1 < theBskt.size(); iName1++) {
        for (let iName2 = 0; iName2 < theBskt.size(); iName2++) {
            print(`${correlsTrand[iName1][iName2]} , `);
        }
    }

});
