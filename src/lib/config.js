export const config = function () {
    return {
        watchlist: {
            futures: [{
                name: "NIFTY",
                expiry: "20180830"
            },
            {
                name: "BANKNIFTY",
                expiry: "20180802"
            },
            {
                name: "NIFTY",
                expiry: "20180827"
            },
            {
                name: "BANKNIFTY",
                expiry: "20180809"
            }
            ]
        },
        feedInterval: 1000 * 60 * 5,
    //  feedInterval: 1000 * 5,
        port: 3000,
        runHeadless: true,
        testMode : false
    }
}