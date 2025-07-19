"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_STATUS = exports.GATEWAY = void 0;
const client_1 = require("./rest/client");
const shared_enum_1 = require("./rest/enum/shared.enum");
Object.defineProperty(exports, "GATEWAY", { enumerable: true, get: function () { return shared_enum_1.GATEWAY; } });
Object.defineProperty(exports, "PAYMENT_STATUS", { enumerable: true, get: function () { return shared_enum_1.PAYMENT_STATUS; } });
exports.default = client_1.PaymentRestClient;
