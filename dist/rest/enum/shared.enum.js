"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_STATUS = exports.GATEWAY = void 0;
var GATEWAY;
(function (GATEWAY) {
    GATEWAY["ZAIN"] = "ZAIN";
    GATEWAY["FIB"] = "FIB";
})(GATEWAY || (exports.GATEWAY = GATEWAY = {}));
var PAYMENT_STATUS;
(function (PAYMENT_STATUS) {
    PAYMENT_STATUS["TIMED_OUT"] = "TIMED_OUT";
    PAYMENT_STATUS["PENDING"] = "PENDING";
    PAYMENT_STATUS["PAID"] = "PAID";
    PAYMENT_STATUS["CANCELED"] = "CANCELED";
    PAYMENT_STATUS["FAILED"] = "FAILED";
    PAYMENT_STATUS["SETTLED"] = "SETTLED";
})(PAYMENT_STATUS || (exports.PAYMENT_STATUS = PAYMENT_STATUS = {}));
