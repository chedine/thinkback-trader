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
    Option = 1,
    Stock = 2,
    StockFuture = 3,
    StockOption = 4,
    CurrencyFuture = 5,
    CurrencyOption = 6
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
    tradeDate: Moment,
    vol?: number,
    oi?: number,
    symbol: string
}

interface FNO extends Scrip {
    expiryDate: Moment,
}

interface Option extends FNO {
    expiryDate: Moment,
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