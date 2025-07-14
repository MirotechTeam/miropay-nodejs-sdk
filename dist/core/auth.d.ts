import type { IAuthenticator } from "./interface/authenticator.interface";
import type { Dispatcher } from "undici";
export declare class PrivateKeyAuthenticator implements IAuthenticator {
    private _encryptedPvKey;
    private _secret;
    constructor(_encryptedPvKey: string, _secret: string);
    makeSignature(method: Dispatcher.HttpMethod, relativeUrl: string): string;
    get keyId(): string;
    get secret(): string;
    set secret(value: string);
    get encryptedPvKey(): string;
    set encryptedPvKey(value: string);
}
