var test = require('tape');
var proxyquire = require('proxyquire');
import * as lib from "./../../src/lib/dateandtime";
import * as mocks from "./mocks";
import {KiteClient,getKiteConnector} from "./../../src/kite/kite";
import * as feed from "./../../src/main/feed";
import { FNOWatchListItem, ScripType } from "../../types/types";

test('Feeder Tests', async function (t) {
    const kiteClient = new KiteClient(mocks.mockKiteConnector);
    const scheduler = await feed.main("mocktoken");
    t.end();
});