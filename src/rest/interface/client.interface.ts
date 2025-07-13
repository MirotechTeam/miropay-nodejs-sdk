import { GATEWAY, PAYMENT_STATUS } from "../enum/shared.enum";
import { IHttpResponse } from "./shared.interface";

// ** ======================== Create Payment ======================= ** //
export interface ICreatePayment {
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

export interface ICreatePaymentResponse
  extends IHttpResponse<ICreatePaymentResponseBody> {}

// ** ========================= Get Payment ========================= ** //
interface IPaymentDetailsResponseBody {
  status: PAYMENT_STATUS;
}

export interface IPaymentDetailsResponse
  extends IHttpResponse<IPaymentDetailsResponseBody> {}

// ** ======================== Cancel Payment ======================= ** //
interface ICancelPaymentResponseBody {}

export interface ICancelPaymentResponse
  extends IHttpResponse<ICancelPaymentResponseBody> {}
