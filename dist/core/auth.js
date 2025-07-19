"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateKeyAuthenticator = void 0;
const node_crypto_1 = require("node:crypto");
class PrivateKeyAuthenticator {
    _encryptedPvKey;
    _secret;
    // ** ========================= Constructor ========================= ** //
    constructor(_encryptedPvKey, _secret) {
        this._encryptedPvKey = _encryptedPvKey;
        this._secret = _secret;
        this._encryptedPvKey = _encryptedPvKey;
        this._secret = _secret;
    }
    // ** =========================== Methods =========================== ** //
    makeSignature(method, relativeUrl, payload) {
        const rawSign = `${method} || ${this.secret} || ${relativeUrl} || ${payload}`;
        const bufSign = Buffer.from(rawSign, "base64");
        return (0, node_crypto_1.sign)(null, bufSign, {
            key: this.encryptedPvKey,
            passphrase: this.secret,
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
}
exports.PrivateKeyAuthenticator = PrivateKeyAuthenticator;
