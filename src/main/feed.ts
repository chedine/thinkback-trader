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
        symbol : "",
        type : type,
        expiryDate : expiry,
        underlying: underlying
    }
});

const symbolsToWatchFor = (config): FNOWatchListItem[] => {
    const futuresToWatch = config.watchlist.futures;
    const builder = buildWatchListItem(ScripType.Future);
    return futuresToWatch.map(f => builder(f.expiry, f.name))
}

const schedulePolling = R.curry((interval: number, kiteClient: KiteClient, onComplete, watchlist: FNOWatchListItem[]) => {
    setInterval(async function(){
        const response = await kiteClient.getQuote(watchlist);
        onComplete(response);
    }, interval);
});

const handleFeedData = R.curry(async (store: any, response: FNO[]) => {
    console.log(response);
    await store.insertTradeData(response);
});

async function main(accessToken: string) {
    //Inits
    const env = ENV.env();
    const kiteConn = getKiteConnector(env.apiKey, accessToken);
    const kiteClient = new KiteClient(kiteConn);
    const datastore = await store.init();
    const feedHandler = handleFeedData(datastore);
    const symbolsToWatch = symbolsToWatchFor(cfg.config());

    // Start collecting feed.
    const baseData = await kiteClient.getQuote(symbolsToWatch);
    const fullWatchList = nfo.buildFNOWatchList(baseData);
    const feedSchedule = schedulePolling(1000*60*10, kiteClient, feedHandler);

    //Schedule to collect data feed for the complete watchlist.
    feedSchedule(fullWatchList);
}

console.log("Feeder Started !!");
const input = process.argv.slice(2);
const accessToken = input[0];
main(accessToken);