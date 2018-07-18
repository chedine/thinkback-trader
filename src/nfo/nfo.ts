import * as moment from "moment";
import * as R from "ramda";
import * as nfo from "./nfo";
import * as datelib from "./../lib/dateandtime";
import { FNO, OptionPref, FNOWatchListItem, OptionType, ScripType } from "../../types/types";


const optionsPreferences = {
    "NIFTY": {
        distance: 100,
        strikes: 10,
        multiple: 100
    },
    "BANKNIFTY": {
        distance: 50,
        strikes: 15,
        multiple: 50
    }
}
const getOptionsPreference = function (underlying: string): OptionPref {
    const preferredVal = optionsPreferences[underlying.toUpperCase()];
    if (preferredVal !== undefined) {
        return preferredVal;
    }
    throw new Error(`${underlying} is not configured yet! `);
}

function getOptionsRange(median: number, multiple: number, noOfStrikes: number): number[] {
    const range = new Array<number>();
    const upperBound = median + (multiple * noOfStrikes);
    const lowerBound = median - (multiple * noOfStrikes);
    for (var i = 0; i < (2 * noOfStrikes) + 1; i++) {
        range.push(lowerBound + (multiple * i));
    }
    return range;
}

function buildOptionsSymbol(symbol: string, rangeOfStrikes: number[], expiryDate: string): FNOWatchListItem[] {
    const optionSymbolList = new Array<FNOWatchListItem>();
    const expiryDt = datelib.dateToString("YYYYMMM", datelib.isoDateStrToDate(expiryDate)).substring(2).toUpperCase();
    const makeWatchListItem = (symbol) => {
        const optionSymbol: FNOWatchListItem = {
            symbol: `NFO:NIFTY${expiryDt}${rangeOfStrikes[i]}CE`,
            type: ScripType.Option,
            expiryDate: expiryDate,
            underlying: symbol
        }
        return optionSymbol;
    }
    for (var i = 0; i < rangeOfStrikes.length; i++) {
        const ce: FNOWatchListItem = makeWatchListItem(`NFO:NIFTY${expiryDt}${rangeOfStrikes[i]}CE`);
        const pe: FNOWatchListItem = makeWatchListItem(`NFO:NIFTY${expiryDt}${rangeOfStrikes[i]}PE`);
        optionSymbolList.push(ce);
        optionSymbolList.push(pe);
    };
    return optionSymbolList;
}
/**
 * 
 * @param futures 
 */
export function buildFNOWatchList(futures: FNO[]): FNOWatchListItem[] {
    let watchList = new Array<FNOWatchListItem>();
    futures.forEach(fut => {
        const opPreference = getOptionsPreference(fut.underlying);
        const multiple = opPreference.multiple;
        const atmPrice = Math.ceil(fut.close / multiple) * multiple;
        const optionsList: FNOWatchListItem[] = buildOptionsSymbol(fut.underlying,
            getOptionsRange(atmPrice, multiple, opPreference.strikes), datelib.dateToISOString(moment(fut.expiryDate)));
        
        watchList = watchList.concat(optionsList);
        watchList.push({
            symbol: fut.symbol,
            type: ScripType.Future,
            expiryDate: datelib.dateToISOString(moment(fut.expiryDate)),
            underlying: fut.underlying
        });
        //TODO: Push future contract details as well.
    });
    return watchList;
}

export const symbolizeFuture = function (underlying: string, expiryDate: moment.Moment){
    const dateInYYMON = expiryDate.format("YYMMM").toUpperCase();
    return `NFO:${underlying}${dateInYYMON}FUT`;
}

export function makeFuture (underlying: string, expiryDate: moment.Moment, kiteResponse ): FNO{
    return {
        expiryDate : datelib.encodeDate(expiryDate),
        expiryDateTs : expiryDate.valueOf(),
        underlying : underlying,
        open : kiteResponse.ohlc.open,
        low : kiteResponse.ohlc.low,
        high : kiteResponse.ohlc.high,
        close : kiteResponse.ohlc.close,
        type : ScripType.Future,
        tradeDate : datelib.encodeDate(kiteResponse.last_trade_time),
        tradeHour : datelib.encodeTime(kiteResponse.last_trade_time),
        tradeDateTs : kiteResponse.last_trade_time.getTime(),
        vol : kiteResponse.volume,
        oi : kiteResponse.oi,
        symbol : kiteResponse.symbol
    }
}