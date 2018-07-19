var test = require('tape');
import * as nfo from "./../../src/nfo/nfo";
import * as dates from "./../../src/lib/dateandtime";
import { FNO, ScripType } from "../../types/types";

test('NFO watchlist tests', function (t) {
    t.plan(21);
    const expDt = "20180726";
    const expDate = dates.isoDateStrToDate(expDt);

    const tradeDt = "20180725";
    const tradeDate = dates.isoDateStrToDate(expDt);
    const future: FNO = {
        expiryDate: dates.encodeDate(expDate),
        close: 10570,
        open: 10400,
        high: 10900,
        low: 10300,
        expiryDateTs: expDate.valueOf(),
        oi: 1,
        symbol: "NFO:NIFTY18JULFUT",
        tradeDate: dates.encodeDate(tradeDate),
        tradeDateTs: tradeDate.valueOf(),
        tradeHour: dates.encodeTime(tradeDate),
        type: ScripType.Future,
        underlying: "NIFTY",
        vol: 100
    };

    const watchlist = nfo.buildFNOWatchList([future]);
    const futureItm = watchlist.find(e => e.symbol === 'NFO:NIFTY18JULFUT');
    const ceSample = watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL11000CE');
    const peSample = watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL11000PE');

    t.equals(39, watchlist.length);
    t.equals(true, futureItm !== undefined);
    if (futureItm !== undefined) {
        t.equals("NIFTY", futureItm.underlying);
    }
    t.equals(true, ceSample !== undefined);
    if (ceSample !== undefined) {
        t.equals("NIFTY", ceSample.underlying);
        t.equals(ScripType.CallOption, ceSample.type)
        t.equals(expDt, ceSample.expiryDate);
    }
    
    t.equals(true, peSample !== undefined);
    if (peSample !== undefined) {
        t.equals("NIFTY", peSample.underlying);
        t.equals(ScripType.PutOption, peSample.type)
        t.equals(expDt, peSample.expiryDate);
    }
    //Lower bound
    t.equals(true, watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL9700PE') !== undefined)
    t.equals(true, watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL9700CE') !== undefined)
    //upper bound
    t.equals(true, watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL11500PE') !== undefined)
    t.equals(true, watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL11500CE') !== undefined)
    //Lower bound is capped @ 9700
    t.equals(true, watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL9600PE') === undefined)
    t.equals(true, watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL9600CE') === undefined)
    //Upper bound is capped @11500
    t.equals(true, watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL11600PE') === undefined)
    t.equals(true, watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL11600CE') === undefined)
    //Median strike
    t.equals(true, watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL10500CE') !== undefined)
    t.equals(true, watchlist.find(e => e.symbol === 'NFO:NIFTY18JUL10500PE') !== undefined)
});