var test = require('tape');
import * as lib from "./../../src/lib/dateandtime";
import * as mocks from "./mocks";
import {KiteClient} from "./../../src/kite/kite";
import { FNOWatchListItem, ScripType, FNO } from "../../types/types";

test('Kite getQuote tests', async function (t) {
    const client = new KiteClient(mocks.mockKiteConnector);
    const mockRequest = new Array<FNOWatchListItem>();
    mockRequest.push({
        symbol : "NFO:NIFTY18JULFUT",
        type: ScripType.Future,
        underlying:"NIFTY",
        expiryDate: "20180726"
    });

    const response: FNO[] = await client.getQuote(mockRequest);
    t.equals(1, response.length);

    const nifty = response[0];
    t.equals("NFO:NIFTY18JULFUT", nifty.symbol);
    t.equals(98.67, nifty.close);
    t.equals(94, nifty.low);
    t.equals(99, nifty.high);
    t.equals(95, nifty.open);
    t.equals(ScripType.Future, nifty.type);
    t.equals(4455, nifty.oi)
    t.equals(20180706, nifty.tradeDate);
    t.end();
});