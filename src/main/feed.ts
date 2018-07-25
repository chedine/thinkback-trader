import * as R from "ramda";
import * as datelib from "./../lib/dateandtime";
import { ScripType, FNOWatchListItem, FNO } from "../../types/types";
import {KiteClient, getKiteConnector} from "./../kite/kite";
const KiteConnect = require("kiteconnect").KiteConnect;
import * as ENV from "./../main/env";
import * as cfg from "./../lib/config";
import * as nfo from "./../nfo/nfo";
import * as store from "./../store/db";

const buildWatchListItem = R.curry((type: ScripType, expiry: string, 
    underlying: string): FNOWatchListItem => {
    return {
        symbol : nfo.symbolizeFuture(underlying, datelib.isoDateStrToDate(expiry)),
        type : type,
        expiryDate : expiry,
        underlying: underlying
    }
});

const buildFNOWatchList = (config): FNOWatchListItem[] => {
    const futuresToWatch = config.watchlist.futures;
    const builder = buildWatchListItem(ScripType.Future);
    return futuresToWatch.map(f => builder(f.expiry, f.name))
}

const schedulePolling = R.curry((interval: number, kiteClient: KiteClient, onComplete, watchlist: FNOWatchListItem[]) => {
    return setInterval(async function(){
        console.log("Polling ...");
        const response = await kiteClient.getQuote(watchlist);
        onComplete(response, interval);
    }, interval);
});

const handleFeedData = R.curry(async (store: any, response: FNO[], interval) => {
    console.log(response);
    await store.insertTradeData(response);
    console.log("Data inserted !!");
    if(response[0].tradeHour === 153000){
        //Closing bell
        console.log("Closing hour reached. Shutting down Feed service !!");
        clearInterval(interval);
    }
});

export async function main(accessToken: string,config) {
    //Inits
    const env = ENV.env();
    const kiteConn = getKiteConnector(env.apiKey, accessToken);
    const kiteClient = new KiteClient(kiteConn);
    const datastore = await store.init();
    const feedHandler = handleFeedData(datastore);
    const symbolsToWatch = buildFNOWatchList(config);

    // Start collecting feed.
    console.log("Preparing to collect feed ...");
    const baseData = await kiteClient.getQuote(symbolsToWatch);
    const fullWatchList = nfo.buildFNOWatchList(baseData);
    const feedSchedule = schedulePolling(config.feedInterval, kiteClient, feedHandler);

    //Schedule to collect data feed for the complete watchlist.
    const scheduledIntervl = feedSchedule(fullWatchList);
    console.log("Scheduled data feed ..");
    return scheduledIntervl;
}

console.log("Feeder Started !!");
const input = process.argv.slice(2);
const accessToken = input[0];
main(accessToken, cfg.config());