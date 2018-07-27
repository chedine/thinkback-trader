/**
 * 
 */
var KiteConnect = require("kiteconnect").KiteConnect;
import * as ENV from "./../main/env";
import * as nfo from "./../nfo/nfo";
import { FNOWatchListItem, FNO, ScripType } from "../../types/types";
import * as store from "./../store/db";
import * as datelib from "./../lib/dateandtime";

const env = ENV.env();
const apiKey = env.apiKey;
const apiSecret = env.apiPass;
const defaultSymbol = "NIFTY";
/**
 * 
 * @param apiKey 
 * @param onShutDown 
 */
function makeKiteClient(apiKey: string, onShutDown) {
    this.kc = new KiteConnect({
        api_key: apiKey
    });
    this.kc.setSessionExpiryHook = function () {
        if (!onShutDown) {
            onShutDown();
        }else{
            console.log("Session expired. Shutting down");
            process.exit();
        }
    };
    this.startSession = async function (accessToken: string) {
        await this.kc.setAccessToken(accessToken);
    }
    this.getMargins = async function () {
        return await this.kc.getMargins();
    }

    this.getQuote = async function (symbolList: string[]) {
        //["NFO:NIFTY18JUL10600CE", "NFO:NIFTY18JUL10700CE", "NSE:INDIA VIX"]
        return await this.kc.getQuote(symbolList);
    }

    this.getInstruments = async function (symbolList: string[]) {
        return await this.kc.getInstruments(["NSE", "NFO"]);
    }
}
/**
 * 
 */
function makeWatchList(kiteClient, symbolsToTrack: FNOWatchListItem[]) {
    this.seed = symbolsToTrack;
    this.watchList = null;
    this.kiteClient = kiteClient;

    this.getFutureData = async function (watchList: FNOWatchListItem[]): Promise<FNO[]> {
        const symbols = watchList.map(item => item.symbol);
        console.log("Fetching , ", symbols);
        const kiteResponse = await this.kiteClient.getQuote(symbols);
        return watchList.map(item => {
            const response = kiteResponse[item.symbol]; //TODO: Can be null
            console.log(" Kite Response : " , kiteResponse, item.symbol)
            response.symbol = item.symbol;
            return nfo.makeFuture(item.underlying, datelib.isoDateStrToDate(item.expiryDate), response);
        })
    };

    this.buildWatchList = async function () {
        const futureData: FNO[] = await this.getFutureData(this.seed);
        return nfo.buildFNOWatchList(futureData);
    }

    this.refresh = async function () {
        if (this.watchList !== null) {
            //console.log("Refreshing Watchlist ", JSON.stringify(this.watchList));
            console.log("Refreshing Watchlist ", this.watchList.length);
            const data = await this.getFutureData(this.watchList);
            // console.log(data);
            return data;
        }
        else {
            await this.bootstrap();
        }
    }

    this.bootstrap = async function () {
        console.log(" WatchList is empty.. Seed used : ", JSON.stringify(this.seed));
        this.watchList = await this.buildWatchList();
    }

}
/**
 * 
 */
function sessionHook() {
    console.log("User loggedout");
}

const delay = (duration) =>
    new Promise(resolve => setTimeout(resolve, duration));
/**
 * 
 */
async function main(accessToken) {

    if (input.length === 0) {
        console.log("AccessToken token is expected. ")
        console.log("Sample usage: node zerodha myaccesstokenhere ")
    }
    else {
        const client = new makeKiteClient(apiKey, sessionHook);
        const datastore = await store.init();
        const nifty: FNOWatchListItem = {
            symbol: nfo.symbolizeFuture("NIFTY", datelib.isoDateStrToDate("20180726")),
            type: ScripType.Future,
            expiryDate: "20180726",
            underlying: "NIFTY"
        }
        console.log(accessToken);
        await client.startSession(accessToken);
        const watchList = new makeWatchList(client, [nifty]);
        await watchList.bootstrap();
        //Only 3 requests per second
        await delay(1000);
        watchList.refresh()
            //.then(d => console.log(JSON.stringify(d)))
            .then(d => {
                console.log("Refreshed : " + d.length + " item!");
                return datastore.insertTradeData(d);
            })
            .then(console.log)
            .catch(console.log);

        //client.startSession(accessToken).then(refreshWatchList).then(console.log).catch(console.error);
    }
}
//const client = new makeKiteClient(apiKey, sessionHook);

const input = process.argv.slice(2);
//client.startSession(input[0]).then(refreshWatchList).then(console.log).catch(console.error);
main(input[0]).then(console.log).catch(console.error);  