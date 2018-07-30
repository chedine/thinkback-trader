import { Moment } from "moment";

type QnA = {
    id?: number,
    question: String,
    answer: String
}

type ServerConf = {
    databaseFile: string,
    port?: number,
    callback: ((app: any) => any)
}

type User = {
    apiKey: string,
    name: string,
    password: string
    questions: [QnA]
}
declare const enum ScripType {
    Future = 0,
    CallOption = 1,
    PutOption = 2,
    Stock = 3,
    StockFuture = 4,
    StockOption = 5,
    CurrencyFuture = 6,
    CurrencyOption = 7,
    Index = 8
}
declare const enum OptionType {
    call = 0,
    put = 1
}
interface Scrip {
    underlying: string,
    open: number,
    low: number,
    high: number,
    close: number,
    type: ScripType,
    tradeDate: number,
    tradeDateTs: number,
    tradeHour: number,
    vol?: number,
    oi?: number,
    symbol: string
}

interface FNO extends Scrip {
    expiryDate: number,
    expiryDateTs: number
}

interface Option extends FNO {
    strike?: number,
    opType: OptionType,
    greeks: OptionGreek,
    atm?: boolean,
    itm?: boolean,
    otm?: boolean,
    strikeDepth?: number //no of strikes otm or itm
}

interface OptionGreek {
    delta: number,
    vega: number,
    theta: number,
    gamma: number,
    rho: number,
    price: number
}

type OptionPref = {
    strikes: number,
    multiple: number,
    distance: number
}

interface WatchListItem {
    symbol: string,
    type: ScripType
}

interface FNOWatchListItem extends WatchListItem {
    expiryDate: string,
    underlying: string
}