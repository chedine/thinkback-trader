import express = require("express");
import bodyparser = require("body-parser");

import * as e from "./env";
import * as web from "./../web/webautomation";

const env = e.env();
const user = env.user;
const port = env.port;
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

    // http://127.0.0.1:3000/callback?status=success&request_token=something
    app.get("/callback", (request, response) => {
        response.json({
            status: request.query.status,
            requestToken: request.query.request_token
        });
    });

    return app;
}

async function closeServer(server) {
    await server.close(function () {
        console.log('Shutting down Zerodha callback server!');
        process.exit();
    });
}
/**
 * 
 * @param port 
 */
async function setupZerodhaServer(port) {
    const callbackServer = router();
    const callbackServerInst = callbackServer.listen(port, () => {
        console.log(`Zerodha callback server started on port ${port}`)
    });
    process.on('SIGINT', () => closeServer(callbackServerInst));
    process.on('SIGTERM', () => closeServer(callbackServerInst));
    return callbackServerInst;
}

async function extractRequestToken(browser, page){
    const response = await web.extractInnerTextFromEl("body", page);
    await browser.close();
    return response;
}

async function fetchLoginToken(user) {
    const browserSession = await web.initBrowserSession(env.runheadless, env.kiteURL);
    return await web.loginToZerodha(browserSession, user, extractRequestToken);
}

async function main() {
    console.log("Trader cockpit launching !!");
    const server = await setupZerodhaServer(port);
    const token = await fetchLoginToken(user);
    //await server.close();
    await closeServer(server);
    return token;
}
/**
 * Script used to fetch request token by auto logging into Zerodha
 */
main().then(console.log);