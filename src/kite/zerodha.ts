
var KiteConnect = require("kiteconnect").KiteConnect;
import * as ENV from "./../main/env";
import * as nfo from "./../nfo/nfo";

const env = ENV.env();
const apiKey = env.apiKey;
const apiSecret = env.apiPass;
const defaultSymbol = "NIFTY";
//const symbolsToWatch = nfo.buildOptionsSymbol(defaultSymbol, nfo.getOptionsRange(10700, 100, 10), "20180726");

function makeKiteClient(apiKey: string, onShutDown) {
    this.kc = new KiteConnect({
        api_key: apiKey
    });
    this.kc.setSessionExpiryHook = function () {
        if (!onShutDown) {
            onShutDown();
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

function sessionHook() {
    console.log("User loggedout");
}
const refreshWatchList = async function () {
    const symbolsToWatch = ["NFO:NIFTY18JULFUT"];
    return await client.getQuote(symbolsToWatch);
}
/**startSession("JXiCYC2NuiR333ikHja2r7A1Sc6iaBTS")
    .then(getQuote)
    //.then(getInstruments)
    .then(console.log)
    .catch(console.error)
    .catch(console.error);**/
//console.log(getOptionsRange(10800, 100));    
//console.log("************")
const client = new makeKiteClient(apiKey, sessionHook);

const input = process.argv.slice(2);
if (input.length === 0) {
    console.log("AccessToken token is expected. ")
    console.log("Sample usage: node zerodha myaccesstokenhere ")
}
else {
    client.startSession(input[0])
    .then(refreshWatchList)
    .then(d => console.log(JSON.stringify(d)))
    .catch(console.log);

}    