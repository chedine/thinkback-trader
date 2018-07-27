var test = require('tape');
import * as lib from "./../../src/lib/dateandtime";
 
test('Date Format Tests', function (t) {
    t.plan(2);
    const toDate = lib.isoDateStrToDate("20180101");
    const toStr = lib.dateToISOString(toDate);
    t.equal(toStr, "20180101");

    t.equal(lib.dateAsYYMON(toDate), "18JAN");
});

test('Conversion to JS Date', function (t) {
    t.plan(4);
    const toDate = lib.isoDateStrToDate("20181231");
    const jsDate = lib.momentToJSDate(toDate);
    t.equal(jsDate.getDate(), 31);
    t.equal(jsDate.getFullYear(), 2018);
    t.equal(jsDate.getMonth(), 11);
    t.equal(jsDate.getTime() , lib.jsDateToMoment(jsDate).valueOf());
});

test('Date/Time encode/decode spec', function (t) {
    t.plan(1);
    const toDate = lib.isoDateStrToDate("20181231");
    const encoded = lib.encodeDate(toDate);
    t.equal(encoded, 20181231);
});