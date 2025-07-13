import { PaymentRestClient } from "./rest/client";
import { GATEWAY, PAYMENT_STATUS } from "./rest/enum/shared.enum";
import {
  ICancelPaymentResponse,
  ICreatePayment,
  ICreatePaymentResponse,
  IPaymentDetailsResponse,
} from "./rest/interface/client.interface";

export {
  // ** ======================== Create Payment ======================= ** //
  ICreatePayment,
  ICreatePaymentResponse,

  // ** ========================= Get Payment ========================= ** //
  IPaymentDetailsResponse,

  // ** ======================== Cancel Payment ======================= ** //
  ICancelPaymentResponse,

  // ** ============================= Enum ============================ ** //
  GATEWAY,
  PAYMENT_STATUS,
};
export default PaymentRestClient;
