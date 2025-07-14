"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRestClient = void 0;
const undici_1 = require("undici");
const auth_1 = require("../core/auth");
const shared_const_1 = require("./const/shared.const");
class PaymentRestClient {
    upstreamVersion = 1;
    dispatcher;
    authenticator;
    baseUrl = shared_const_1.apiBaseUrl;
    isTest = true;
    constructor(key, secret) {
        this.dispatcher = new undici_1.Agent({
            connectTimeout: 10 * 1000, // 10 seconds
            factory: (_origin, opts) => {
                return new undici_1.Pool(_origin, {
                    ...opts,
                    connections: 5,
                    allowH2: true,
                    clientTtl: 30 * 1000, // 30 seconds
                });
            },
        }).compose(undici_1.interceptors.dns({ affinity: 4 }), undici_1.interceptors.retry({ maxRetries: 3 }), undici_1.interceptors.cache({
            methods: ["GET", "HEAD", "OPTIONS"],
            cacheByDefault: 5, //seconds
        }));
        this.authenticator = new auth_1.PrivateKeyAuthenticator(key, secret);
        this.isTest = this.checkIsTest(secret);
    }
    // ** ======================== Basic Methods ======================== ** //
    /**
     * * Basic api call
     */
    async __call(path, verb, requestBody) {
        const v = `/v${this.upstreamVersion}`;
        const relativeUrl = `${v}/payment/rest/${this.isTest ? "test" : "live"}${path}`;
        const versionedUrl = `${this.baseUrl}${relativeUrl}`;
        const signature = this.authenticator.makeSignature(verb, relativeUrl);
        try {
            const res = await (0, undici_1.request)(versionedUrl, {
                dispatcher: this.dispatcher,
                method: verb,
                body: requestBody,
                headers: {
                    "x-signature": signature,
                    "x-id": this.authenticator.keyId,
                    "Content-Type": "application/json",
                },
            });
            try {
                const jsonBody = await res.body.json();
                /**
                 * * Notice
                 * This condition handles request failures gracefully.
                 * If the server responds with an error (e.g., 4xx or 5xx),
                 * Undici will not throw by default — it returns the error in the response body.
                 *
                 * To maintain type safety and avoid exposing unexpected error shapes to consumers,
                 * we explicitly throw an error when the status code indicates a failure.
                 */
                if (res.statusCode > 209 || res.statusCode < 200) {
                    throw jsonBody;
                }
                return {
                    body: jsonBody,
                    headers: res.headers,
                    statusCode: res.statusCode,
                };
            }
            catch (parseError) {
                throw parseError;
            }
        }
        catch (err) {
            throw err;
        }
    }
    /**
     * * Trim base url
     */
    __trimBaseUrl(hostName) {
        const _https = "https://";
        const _http = "http://";
        // * Parameter host, is optional.
        if (!hostName)
            return this.baseUrl;
        // * Handle protocol.
        if (!hostName.startsWith(_https)) {
            if (hostName.startsWith(_http)) {
                // * Force https
                hostName = hostName.replace(/^http:\/\//, _https);
            }
            else
                hostName = `${_https}${hostName}`;
        }
        // * Handle the ending
        if (hostName.endsWith("/")) {
            return hostName.slice(0, -1); // Slice last `/`.
        }
        return hostName;
    }
    /**
     *
     */
    checkIsTest(secret) {
        return secret.includes("test");
    }
    /**
     * * Get payment by id
     */
    async getPaymentById(referenceCode) {
        return this.__call(`/status/${referenceCode}`, "GET", null);
    }
    /**
     * * Create payment
     */
    async createPayment(payload) {
        const jsonPayload = {
            amount: payload.amount,
            gateways: payload.gateways, // already an array, no need to stringify
            title: payload.title,
            description: payload.description,
            redirectUrl: payload.redirectUrl,
            collectFeeFromCustomer: payload.collectFeeFromCustomer,
            collectCustomerEmail: payload.collectCustomerEmail,
            collectCustomerPhoneNumber: payload.collectCustomerPhoneNumber,
        };
        return this.__call(`/create`, "POST", JSON.stringify(jsonPayload));
    }
    /**
     * * Cancel payment
     */
    async cancelPayment(referenceCode) {
        return this.__call(`/cancel/${referenceCode}`, "POST", null);
    }
}
exports.PaymentRestClient = PaymentRestClient;
