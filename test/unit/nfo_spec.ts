var test = require('tape');
import * as nfo from "./../../src/nfo/nfo";
 
test('options Symbol range test', function (t) {
    t.plan(4);
    const opRange = nfo.getOptionsRange(10500,100,2);
    const expected = [10300,10400,10500,10600,10700];
    t.equal(opRange.length, expected.length);
    t.equal(opRange[0], expected[0]);
    t.equal(opRange[4], expected[4]);
    t.equal(opRange[2], expected[2]);
});

test('NFO Date Utils test', function (t) {
    t.plan(1);
    t.equal(nfo.dateToISOString(nfo.isoDateStrToDate("20180705")), "20180705");
});

test('options Symbol make test', function (t) {
    t.plan(5);
    const opRange = nfo.getOptionsRange(10500,100,2);
    const symbols = nfo.buildOptionsSymbol("NIFTY", opRange, "20180726");
    //const expected = ["NIFTY18JUL10300CE",10400,10500,10600,10700];
    t.equal(symbols.length, 10);
    t.equal(symbols[0], "NFO:NIFTY18JUL10300CE");
    t.equal(symbols[1], "NFO:NIFTY18JUL10300PE");
    t.equal(symbols[2], "NFO:NIFTY18JUL10400CE");
    t.equal(symbols[symbols.length-1], "NFO:NIFTY18JUL10700PE");
});