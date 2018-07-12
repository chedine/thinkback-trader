import * as zerodha from "./../kite/puppet"
import express = require("express");
import bodyparser = require("body-parser");
const { Identity, Maybe, Either, Future, IO } = require("ramda-fantasy");
import * as env from "./env";
import * as web from "./../web/webautomation";

const user = env.env().user;
const port = env.env().port;
/**
 * Basic routes. Needed mainly for the handshake(login) with Zerodha.
 * Zerodha redirects the oauth to the redirect url with the auth token.
 */
export const router = () => {
    const app = express();
    app.use(bodyparser.json());

    app.get("/echo", (request, response) => {
        response.json({
            echo: "Hello from Auth server!"
        })
    });

    app.get("/token", async (request, response) => {
        const userName = request.query.user;
        console.log("Logging in for " + userName);
        fetchLoginToken(user).fork(
            error => response.json({ status: "fail", msg: `user ${userName} not found in registry`, err: error }), // TODO: remove logging error into the response
            results => response.json(JSON.parse(results))
        );
    });

    // http://127.0.0.1:3000/callback?status=success&request_token=something
    app.get("/callback", (request, response) => {
        response.json({
            status: request.query.status,
            requestToken: request.query.request_token
        });
    });

    return app;
}

function closeServer(server) {
    server.close(function () {
        console.log('Shutting down Zerodha callback server!');
        process.exit();
    });
}
/**
 * 
 * @param port 
 */
function setupZerodhaServer(port) {
    const callbackServer = router();
    const callbackServerInst = callbackServer.listen(port, () => {
        console.log(`Zerodha callback server started on port ${port}`)
    });
    process.on('SIGINT', () => closeServer(callbackServerInst));
    process.on('SIGTERM', () => closeServer(callbackServerInst));
}

function fetchLoginToken(user) {
    return zerodha.login(user)
}

async function extractRequestToken(browser, page){
    const response = await web.extractInnerTextFromEl("body", page);
    await browser.close();
    return response;
}
async function fetchLoginToken1(user) {
    const browserSession = await web.initBrowserSession(false, "https://kite.trade/connect/login?api_key=iz0ob9zohb3y2248");
    return await web.loginToZerodha(browserSession, user, extractRequestToken);
}

async function main() {
    console.log("Trader cockpit launching !!");
    setupZerodhaServer(port);
    //fetchLoginToken(user).fork(console.log, console.log);
    return await fetchLoginToken1(user);
}
/**
 * Script used to fetch request token by auto logging into Zerodha
 */
main().then(console.log);