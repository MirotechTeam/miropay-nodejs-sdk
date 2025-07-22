import { ICancelPaymentResponse, ICreatePayment, ICreatePaymentResponse, IPaymentDetailsResponse } from "./interface/client.interface";
export declare class PaymentRestClient {
    private readonly upstreamVersion;
    private readonly dispatcher;
    private readonly authenticator;
    private readonly baseUrl;
    private readonly isTest;
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
     *
     */
    private checkIsTest;
    /**
     * * Get public keys
     */
    private getPublicKeys;
    /**
     * * Get payment by id
     */
    getPaymentById(referenceCode: string): Promise<IPaymentDetailsResponse>;
    /**
     * * Create payment
     */
    createPayment(payload: ICreatePayment): Promise<ICreatePaymentResponse>;
    /**
     * * Cancel payment
     */
    cancelPayment(referenceCode: string): Promise<ICancelPaymentResponse>;
    /**
     * * Verify
     */
    verify(): Promise<boolean>;
}
