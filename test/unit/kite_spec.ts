var test = require('tape');
import * as lib from "./../../src/lib/dateandtime";
import * as mocks from "./mocks";
import {KiteClient} from "./../../src/kite/kite";
import { FNOWatchListItem, ScripType } from "../../types/types";

test('Kite getQuote tests', async function (t) {
    t.plan(1);
    const client = new KiteClient(mocks.mockKiteConnector);
    const mockRequest = new Array<FNOWatchListItem>();
    mockRequest.push({
        symbol : "NFO:NIFTY18JULFUT",
        type: ScripType.Future,
        underlying:"NIFTY",
        expiryDate: "20180726"
    });

    const response = await client.getQuote(mockRequest);
    console.log(response);
});