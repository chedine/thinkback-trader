import { setInterval } from "timers";

const EventEmitter = require('events');

class AppEvents extends EventEmitter {

    AppEvents() {
        process.on('SIGTERM', () => this.emit("Abort"));
        process.on('SIGINT', () => this.emit("Abort"));

    }
    fire = (eventName) => {
        this.emit(eventName);
    }
}
const Events = new AppEvents();
//When interface
const _when = function (evt, isJustOnce?) {
    this.events = [];
    this.once = isJustOnce || false;
    this.cb ;
    this.then = function (cb) {
        this.cb = cb;
    }
    this.and = function(nextEvt){
        this.register(nextEvt);
    }
    this.handle = (e) => () =>{
        //Arrow fn..
        //this really points to 'this' :-
        this.cb();
    }
    this.register = function(event){
        this.events.push(event);
        if (this.once) {
            Events.on(event, this.handle(event));
        }
        else {
            Events.once(event, this.handle(event));
        }
    }
    this.register(evt);
}
const When = (event) => {
    return new _when(event);
};
const WhenEver = (event) => {
    return new _when(event, true);
};

//This works here.. not in constructor
process.on('exit', () => Events.fire("Shutdown"));
var i = 0;
//Wirings
When("sample_event").then(() => console.log("Fired"));
WhenEver("sample_event").then(() => {
    console.log("Fired continously " + i);
});
//WhenEver("sample_event").then(() => console.log("Fired continously1"));
When("Abort").then(() => console.log("Aborted .. Shutting down.."));
When("Shutdown").then(() => console.log("Shutting down.."));

//Simple event clock
setInterval(() => Events.fire("sample_event"), 1000);
setInterval(() => Events.fire("sample_event1"), 3000);