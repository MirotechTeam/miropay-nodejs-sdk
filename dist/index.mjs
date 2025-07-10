// src/rest/client.ts
import {
  Agent,
  FormData,
  interceptors,
  Pool,
  request
} from "undici";

// src/core/auth.ts
import { sign } from "crypto";
var PrivateKeyAuthenticator = class {
  // ** ========================= Constructor ========================= ** //
  constructor(_encryptedPvKey, _secret) {
    this._encryptedPvKey = _encryptedPvKey;
    this._secret = _secret;
    this._encryptedPvKey = _encryptedPvKey;
    this._secret = _secret;
  }
  // ** =========================== Methods =========================== ** //
  makeSignature(method, relativeUrl) {
    const rawSign = `${method} || ${this.secret} || ${relativeUrl}`;
    const bufSign = Buffer.from(rawSign, "base64");
    return sign(null, bufSign, {
      key: this.encryptedPvKey,
      passphrase: this.secret
    }).toString("base64");
  }
  get keyId() {
    return this._secret;
  }
  // ** ====================== Getters / Setters ====================== ** //
  get secret() {
    return this._secret;
  }
  set secret(value) {
    this._secret = value;
  }
  get encryptedPvKey() {
    return this._encryptedPvKey;
  }
  set encryptedPvKey(value) {
    this._encryptedPvKey = value;
  }
};

// src/rest/client.ts
var PaymentRestClient = class {
  upstreamVersion = 1;
  dispatcher;
  authenticator;
  baseUrl = "";
  constructor(key, secret, host) {
    this.dispatcher = new Agent({
      connectTimeout: 10 * 1e3,
      // 10 seconds
      factory: (_origin, opts) => {
        return new Pool(_origin, {
          ...opts,
          connections: 5,
          allowH2: true,
          clientTtl: 30 * 1e3
          // 30 seconds
        });
      }
    }).compose(
      interceptors.dns({ affinity: 4 }),
      interceptors.retry({ maxRetries: 3 }),
      interceptors.cache({
        methods: ["GET", "HEAD", "OPTIONS"],
        cacheByDefault: 5
        //seconds
      })
    );
    this.authenticator = new PrivateKeyAuthenticator(key, secret);
    this.baseUrl = host;
  }
  async __call(path, verb, body) {
    const v = `/v${this.upstreamVersion}`;
    const versionedUrl = this.baseUrl + v + path;
    const signature = this.authenticator.makeSignature(verb, path);
    return request(versionedUrl, {
      dispatcher: this.dispatcher,
      method: verb,
      body,
      headers: { "x-signature": signature, "x-id": this.authenticator.keyId }
    });
  }
  /**
   * * Get payment by id
   */
  async getById(id) {
    return this.__call(`/merchant/payment/internal/${id}`, "GET", null);
  }
  /**
   * * Create payment
   */
  async createPayment(payload) {
    const formData = new FormData();
    formData.append("amount", payload.amount);
    formData.append("expirationDateTime", payload.expirationDateTime);
    formData.append("gateways", payload.gateways);
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("redirectUrl", payload.redirectUrl);
    formData.append("collectFeeFromCustomer", payload.collectFeeFromCustomer);
    formData.append("collectCustomerEmail", payload.collectCustomerEmail);
    formData.append(
      "collectCustomerPhoneNumber",
      payload.collectCustomerPhoneNumber
    );
    return this.__call(`/merchant/payment/internal`, "POST", formData);
  }
  /**
   * * Cancel payment
   */
  async cancelPayment(id) {
    return this.__call(`/merchant/payment/internal/cancel/${id}`, "POST", null);
  }
};

// src/index.ts
var index_default = PaymentRestClient;
export {
  index_default as default
};
