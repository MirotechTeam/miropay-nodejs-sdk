import { GATEWAY, PAYMENT_STATUS } from "../enum/shared.enum";
import { IHttpResponse } from "./shared.interface";
export interface ICreatePayment {
    /** Price as string, e.g. "1000" */
    amount: number;
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
    referenceCode: string;
    amount: string;
    paidVia: string | null;
    paidAt: string | null;
    redirectUrl: string;
    status: PAYMENT_STATUS;
    payoutAmount: string | null;
}
export interface ICreatePaymentResponse extends IHttpResponse<ICreatePaymentResponseBody> {
}
interface IPaymentDetailsResponseBody {
    referenceCode: string;
    amount: string;
    paidVia: string | null;
    paidAt: string | null;
    callbackUrl: string;
    status: PAYMENT_STATUS;
    payoutAmount: string | null;
}
export interface IPaymentDetailsResponse extends IHttpResponse<IPaymentDetailsResponseBody> {
}
interface ICancelPaymentResponseBody {
    referenceCode: string;
    amount: string;
    paidVia: string | null;
    paidAt: string | null;
    callbackUrl: string;
    status: PAYMENT_STATUS;
    payoutAmount: string | null;
}
export interface ICancelPaymentResponse extends IHttpResponse<ICancelPaymentResponseBody> {
}
export interface IPublicKeyResponseBody {
    id: string;
    key: string;
}
export interface IPublicKeysResponse extends IHttpResponse<IPublicKeyResponseBody[]> {
}
export interface IVerifyPayload {
    keyId: string;
    content: string | undefined;
}
export interface IVerifyPaymentResponseBody {
    referenceCode: string;
    status: PAYMENT_STATUS;
    payoutAmount: string | null;
}
export interface IVerifyPaymentResponse extends IHttpResponse<IVerifyPaymentResponseBody> {
}
export {};
