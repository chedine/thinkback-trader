export const config = function () {
    return {
        watchlist: {
            futures: [{
                name: "NIFTY",
                expiry: "20180726"
            },
            {
                name: "BANKNIFTY",
                expiry: "20180726"
            }]
        },
        feedInterval: 1000 * 60 * 5,
    //    feedInterval: 1000 * 5,
        port:3000,
        runHeadless: true
    }
}