import { GATEWAY } from "../enum/shared.enum";

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
