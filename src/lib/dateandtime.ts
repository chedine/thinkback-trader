import * as moment from "moment";
import * as R from "ramda";

export const dateStrToDate = R.curry((format: string, dateStr: string): moment.Moment =>
    moment(dateStr, format));

export const isoDateStrToDate = dateStrToDate("YYYYMMDD");

export const dateToString = R.curry((format: string, date: moment.Moment): string =>
    date.format(format));

export const dateToISOString = dateToString("YYYYMMDD");

export const momentToJSDate = (moment: moment.Moment): Date => {
    return moment.toDate();
}

export const jsDateToMoment = (jsdate: Date): moment.Moment => {
    return moment(jsdate);
}

export const encodeDate = (moment: moment.Moment): number => {
    return parseInt(moment.format("YYYYMMDD"));
}

export const encodeTime = (moment: moment.Moment): number => {
    return parseInt(moment.format("HHmmss"));
}

export const dateAsYYMON = (moment: moment.Moment): string => {
    return moment.format("YYMMM").toUpperCase();
}

export const tsToMoment = (ts: number): moment.Moment => {
    return moment(ts);
}