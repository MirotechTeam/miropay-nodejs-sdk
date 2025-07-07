"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  PaymentRestClient: () => PaymentRestClient
});
module.exports = __toCommonJS(index_exports);

// src/rest/client.ts
var import_undici = require("undici");

// src/core/auth.ts
var import_node_crypto = require("crypto");
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
    return (0, import_node_crypto.sign)(null, bufSign, {
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
  constructor(key, secret2, host) {
    this.dispatcher = new import_undici.Agent({
      connectTimeout: 10 * 1e3,
      // 10 seconds
      factory: (_origin, opts) => {
        return new import_undici.Pool(_origin, {
          ...opts,
          connections: 5,
          allowH2: true,
          clientTtl: 30 * 1e3
          // 30 seconds
        });
      }
    }).compose(
      import_undici.interceptors.dns({ affinity: 4 }),
      import_undici.interceptors.retry({ maxRetries: 3 }),
      import_undici.interceptors.cache({
        methods: ["GET", "HEAD", "OPTIONS"],
        cacheByDefault: 5
        //seconds
      })
    );
    this.authenticator = new PrivateKeyAuthenticator(key, secret2);
  }
  async __call(path, verb, body) {
    const v = `/v${this.upstreamVersion}`;
    const versionedUrl = v + path;
    const signature = this.authenticator.makeSignature(verb, path);
    return (0, import_undici.request)(versionedUrl, {
      dispatcher: this.dispatcher,
      method: verb,
      body,
      headers: { "x-signature": signature, "x-id": this.authenticator.keyId }
    });
  }
  async getById(id) {
    return this.__call("/payment/rest/get", "GET", null);
  }
};
var pvKey = "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIGbMFcGCSqGSIb3DQEFDTBKMCkGCSqGSIb3DQEFDDAcBAgQlVzPX3gvjAICCAAw\nDAYIKoZIhvcNAgkFADAdBglghkgBZQMEASoEEKz5GXvEyaTt/vh9gGKsjPQEQE1P\n1SlTGa1/T5TB1f9baTLqKrShG/hMSa1tuL5qb5221XGkppGiP3in8zoZ2twna2hR\naScxcVX7P1JrpwD9ucY=\n-----END ENCRYPTED PRIVATE KEY-----\n";
var secret = "test_ipstsF54V-pwrL_N14kaA_2Gy6o-vq7rA2nu7FOtvhc_SA";
var prc = new PaymentRestClient(pvKey, secret, "http://localhost:3000");
prc.getById(1).then((v) => {
  console.log(v);
}).catch((e) => {
  console.error(e);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PaymentRestClient
});
