import { IncomingHttpHeaders } from 'undici/types/header';

declare enum GATEWAY {
    ZAIN = "ZAIN",
    FIB = "FIB"
}
declare enum PAYMENT_STATUS {
    TIMED_OUT = "TIMED_OUT",
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELED = "CANCELED",
    FAILED = "FAILED",
    SETTLED = "SETTLED"
}

interface IHttpResponse<T> {
    body: T;
    headers: IncomingHttpHeaders;
    statusCode: number;
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
interface ICreatePaymentResponseBody {
    success: boolean;
}
interface ICreatePaymentResponse extends IHttpResponse<ICreatePaymentResponseBody> {
}
interface IPaymentDetailsResponseBody {
    status: PAYMENT_STATUS;
}
interface IPaymentDetailsResponse extends IHttpResponse<IPaymentDetailsResponseBody> {
}
interface ICancelPaymentResponseBody {
}
interface ICancelPaymentResponse extends IHttpResponse<ICancelPaymentResponseBody> {
}

declare class PaymentRestClient {
    private readonly upstreamVersion;
    private readonly dispatcher;
    private readonly authenticator;
    private readonly baseUrl;
    constructor(key: string, secret: string);
    /**
     * * Basic api call
     */
    private __call;
    /**
     * * Trim base url
     */
    private __trimBaseUrl;
    /**
     * * Get payment by id
     */
    getPaymentById(id: string | number): Promise<IPaymentDetailsResponse>;
    /**
     * * Create payment
     */
    createPayment(payload: ICreatePayment): Promise<ICreatePaymentResponse>;
    /**
     * * Cancel payment
     */
    cancelPayment(id: string | number): Promise<ICancelPaymentResponse>;
}

export { GATEWAY, type ICancelPaymentResponse, type ICreatePayment, type ICreatePaymentResponse, type IPaymentDetailsResponse, PAYMENT_STATUS, PaymentRestClient as default };
