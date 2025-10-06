"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_STATUS = exports.GATEWAY = void 0;
var GATEWAY;
(function (GATEWAY) {
    GATEWAY["FIB"] = "FIB";
    GATEWAY["ZAIN"] = "ZAIN";
    GATEWAY["ASIA_PAY"] = "ASIA_PAY";
    GATEWAY["FAST_PAY"] = "FAST_PAY";
    GATEWAY["SUPER_QI"] = "SUPER_QI";
    GATEWAY["NASS_WALLET"] = "NASS_WALLET";
    GATEWAY["YANA"] = "YANA";
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
