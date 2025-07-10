import { Dispatcher, FormData } from 'undici';
import { Readable } from 'stream';

declare enum GATEWAY {
    ZAIN = "ZAIN",
    FIB = "FIB"
}

interface ICreatePayment {
    /** Price as string, e.g. "1000" */
    amount: string;
    /** Expiration datetime as JS Date object */
    expirationDateTime: Date;
    /** List of allowed gateways; empty array means all are allowed */
    gateways: GATEWAY[];
    /** Max 63 characters */
    title: string;
    /** Max 255 characters */
    description: string;
    redirectUrl: string;
    collectFeeFromCustomer: boolean;
    collectCustomerEmail: boolean;
    collectCustomerPhoneNumber: boolean;
}

declare class PaymentRestClient {
    private readonly upstreamVersion;
    private readonly dispatcher;
    private readonly authenticator;
    private readonly baseUrl;
    constructor(key: string, secret: string, host: string);
    __call(path: string, verb: Dispatcher.HttpMethod, body: string | Buffer | Uint8Array | Readable | null | FormData): Promise<Dispatcher.ResponseData<null>>;
    /**
     * * Get payment by id
     */
    getById(id: string | number): Promise<Dispatcher.ResponseData<null>>;
    /**
     * * Create payment
     */
    createPayment(payload: ICreatePayment): Promise<Dispatcher.ResponseData<null>>;
    /**
     * * Cancel payment
     */
    cancelPayment(id: string | number): Promise<Dispatcher.ResponseData<null>>;
}

export { PaymentRestClient as default };
