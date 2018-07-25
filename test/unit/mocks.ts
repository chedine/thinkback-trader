export const mockKiteConnector = {
    getQuote : function(symbols: string[]){
        console.log("Supplying mock quotes ");
        return mockResponses;
    },
    getInstruments: function(symbols: string[]){

    },
    getMargins : function(){

    }
}

const mockResponses = {
    "NFO:NIFTY18JULFUT" : {
        instrument_token : 112345,
        timestamp : new Date(),
        last_price : 100,
        last_quantity: 75,
        last_trade_time : new Date("2018-07-06T15:23:59.000Z"),
        average_price : 100.5,
        volume : 2456,
        buy_quantity: 78750,
        sell_quantity: 998,
        ohlc : {
            open : 95,
            low: 94,
            high: 99,
            close:98.67
        },
        net_change : 2.3,
        oi:4455,
        oi_day_high : 4555,
        oi_day_low : 4300
    }
}