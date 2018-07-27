const puppeteer = require("puppeteer");
import * as R from "ramda";
import { User } from "../../types/types";

const delay = (duration) =>
    new Promise(resolve => setTimeout(resolve, duration));

const clickElement = async (selector: string, page) =>
    await page.click(selector);

const typeIntoElement = async (selector: string, page) =>
    await page.type(selector);

const inputInto = async (selector: string, value: string, page) => {
    await clickElement(selector, page);
    await typeIntoElement(value, page);
}
export const closeBrowser = async(browser) => browser.close();

export const extractInnerTextFromEl = async (selector: string, page) =>
    await page.evaluate((sel) => {
        return document.querySelector(sel).innerText;
    }, selector);
/**
 * Given a javascript string and a puppeteer page instance, 
 * executes the javascript in the page context and returns the result of the js eval.
 */
const evalJS = async (js: string, page) => await page.evaluate(js);

const elementLocators = () => {
    return {
        userNameFieldSelector: '#container > div > div > div.login-form > form > div.uppercase.su-input-group > input[type="text"]',
        passwordFieldSelector: '#container > div > div > div.login-form > form > div:nth-child(2) > input[type="password"]',
        loginBtnSelector: "#container > div > div > div.login-form > form > div.actions > button",
        securityQSelector1: '#container > div > div > div.login-form > form > div:nth-child(2) > div > label',
        securityQSelector2: '#container > div > div > div.login-form > form > div:nth-child(3) > div > label',
        securityAnsSelector1: '#container > div > div > div.login-form > form > div:nth-child(2) > div > input[type="password"]',
        securityAnsSelector2: '#container > div > div > div.login-form > form > div:nth-child(3) > div > input[type="password"]',
        securitySubmitBtnSelector: '#container > div > div > div.login-form > form > div.actions > button',
        sensiBullLoginBtn :   "#notloggedInSegment > div:nth-child(3) > button > div > div"
    }
}

function getAnswer(questionSet, question) {
    const matchingQnA = questionSet.filter((qna) => qna.question === question.trim());
    return matchingQnA.length == 0 ? undefined : matchingQnA[0].answer;
}

const findAnswers = R.curry((user: User, q1: string, q2: string) => {
    return {
        q1: getAnswer(user.questions, q1),
        q2: getAnswer(user.questions, q2)
    }
})

const answer2FA = async function(page, user: User){
    const selectors = elementLocators();
    const question1 = await extractInnerTextFromEl(selectors.securityQSelector1, page);
    const question2 = await extractInnerTextFromEl(selectors.securityQSelector2, page);
    const matchingResponse = findAnswers(user, question1, question2);
    await inputInto(selectors.securityAnsSelector1, matchingResponse.q1, page);
    await inputInto(selectors.securityAnsSelector2, matchingResponse.q2, page);
    await clickElement(selectors.securitySubmitBtnSelector, page);
    await page.waitForNavigation();
    return matchingResponse;
}
export const loginToZerodha = async function (browserSession, user: User, callback? : Function) {
    console.log("Logging into Kite");
    const {browser, page} = browserSession; //await initBrowserSession(isHeadless, url);
    const selectors = elementLocators();
    await inputInto(selectors.userNameFieldSelector, user.name,page);
    await inputInto(selectors.passwordFieldSelector, user.password,page);
    await clickElement(selectors.loginBtnSelector, page);
   // await page.waitForNavigation();
    await delay(3000);
    await answer2FA(page, user);
    if(callback){
        return await callback(browser, page);
    }
}

export const initBrowserSession = async function(isHeadless: Boolean, url: String){
    const browser = await puppeteer.launch({ headless: isHeadless, args: ['--start-maximized'] });
    const page = await browser.newPage();
    page.setViewport({ width: 1366, height: 1050 });
    await page.goto(url);
    await delay(3000);
    return {
        browser: browser,
        page: page
    }
}

export const initSensiBullLogin = async function (page){
    await clickElement(elementLocators().sensiBullLoginBtn, page);
    await page.waitForNavigation();
    await delay(3000);
    return page;
}