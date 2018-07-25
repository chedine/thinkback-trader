var KiteConnect = require("kiteconnect").KiteConnect;
import * as ENV from "./../main/env";
import * as nfo from "./../nfo/nfo";
import { FNOWatchListItem, FNO, ScripType } from "../../types/types";
import * as store from "./../store/db";
import * as datelib from "./../lib/dateandtime";
import * as R from "ramda";

export class KiteClient {
    private kc;

    public constructor(kc) {
        this.kc = kc;
    }

    public getMargins = async function () {
        return await this.kc.getMargins();
    }

    public getQuote = async function (symbolList: FNOWatchListItem[]): Promise<FNO[]> {
        //["NFO:NIFTY18JUL10600CE", "NFO:NzzIFTY18JUL10700CE", "NSE:INDIA VIX"]
        const symbols = symbolList.map(item => item.symbol);
        const kiteResponse = await this.kc.getQuote(symbols);
        const extractor = this.extractFNOFromKiteResponse(kiteResponse);
        return symbolList.map(extractor);
    }

    public getInstruments = async function (symbolList: string[]) {
        return await this.kc.getInstruments(["NSE", "NFO"]);
    }

    private extractFNOFromKiteResponse = R.curry((kiteResponse, item: FNOWatchListItem) => {
        //console.log(" Response = ", kiteResponse);
        const response = kiteResponse[item.symbol]; //TODO: Can be null
        response.scripType = item.type;
        response.symbol = item.symbol;
        return nfo.makeFuture(item.underlying, datelib.isoDateStrToDate(item.expiryDate), response);
    });
}

export const getKiteConnector = function(apiKey: string, accessToken: string){
    const client = new KiteConnect({
        api_key : apiKey
    });
    client.setSessionExpiryHook = function(){
        console.log("Default Session Expiry hook invoked !");
    };
    client.setAccessToken(accessToken);
    return client;
}