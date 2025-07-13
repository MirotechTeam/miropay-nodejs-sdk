import {
  Agent,
  Dispatcher,
  FormData,
  interceptors,
  Pool,
  request,
} from "undici";
import { PrivateKeyAuthenticator } from "../core/auth";
import type { Readable } from "stream";
import {
  ICancelPaymentResponse,
  ICreatePayment,
  ICreatePaymentResponse,
  IPaymentDetailsResponse,
} from "./interface/client.interface";
import { apiBaseUrl } from "./const/shared.const";
import { IHttpResponse } from "./interface/shared.interface";

export class PaymentRestClient {
  private readonly upstreamVersion: number = 1;
  private readonly dispatcher: Dispatcher;
  private readonly authenticator: PrivateKeyAuthenticator;
  private readonly baseUrl: string = apiBaseUrl;

  constructor(key: string, secret: string) {
    this.dispatcher = new Agent({
      connectTimeout: 10 * 1000, // 10 seconds
      factory: (_origin: string, opts: Agent.Options): Dispatcher => {
        return new Pool(_origin, {
          ...opts,
          connections: 5,
          allowH2: true,
          clientTtl: 30 * 1000, // 30 seconds
        });
      },
    }).compose(
      interceptors.dns({ affinity: 4 }),
      interceptors.retry({ maxRetries: 3 }),
      interceptors.cache({
        methods: ["GET", "HEAD", "OPTIONS"],
        cacheByDefault: 5, //seconds
      })
    );

    this.authenticator = new PrivateKeyAuthenticator(key, secret);
  }

  // ** ======================== Basic Methods ======================== ** //
  /**
   * * Basic api call
   */
  private async __call<T>(
    path: string,
    verb: Dispatcher.HttpMethod,
    requestBody: string | Buffer | Uint8Array | Readable | null | FormData
  ): Promise<IHttpResponse<T>> {
    const v = `/v${this.upstreamVersion}`;
    const versionedUrl = this.baseUrl + v + path;
    const signature = this.authenticator.makeSignature(verb, path);

    try {
      const res = await request(versionedUrl, {
        dispatcher: this.dispatcher,
        method: verb,
        body: requestBody,
        headers: { "x-signature": signature, "x-id": this.authenticator.keyId },
      });

      try {
        const jsonBody = await res.body.json();

        return {
          data: {} as T,
          body: jsonBody as Record<any, any>,
          headers: res.headers,
          statusCode: res.statusCode,
        };
      } catch (parseError) {
        throw parseError;
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * * Trim base url
   */
  private __trimBaseUrl(hostName: string | undefined): string {
    const _https = "https://";
    const _http = "http://";

    // * Parameter host, is optional.
    if (!hostName) return this.baseUrl;

    // * Handle protocol.
    if (!hostName.startsWith(_https)) {
      if (hostName.startsWith(_http)) {
        // * Force https
        hostName = hostName.replace(/^http:\/\//, _https);
      } else hostName = `${_https}${hostName}`;
    }

    // * Handle the ending
    if (hostName.endsWith("/")) {
      return hostName.slice(0, -1); // Slice last `/`.
    }
    return hostName;
  }

  /**
   * * Get payment by id
   */
  public async getPaymentById(
    id: string | number
  ): Promise<IPaymentDetailsResponse> {
    return this.__call(`/merchant/payment/internal/${id}`, "GET", null);
  }

  /**
   * * Create payment
   */
  public async createPayment(
    payload: ICreatePayment
  ): Promise<ICreatePaymentResponse> {
    const formData = new FormData();

    formData.append("amount", payload.amount);
    formData.append("expirationDateTime", payload.expirationDateTime);
    formData.append("gateways", payload.gateways);
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("redirectUrl", payload.redirectUrl);
    formData.append("collectFeeFromCustomer", payload.collectFeeFromCustomer);
    formData.append("collectCustomerEmail", payload.collectCustomerEmail);
    formData.append(
      "collectCustomerPhoneNumber",
      payload.collectCustomerPhoneNumber
    );

    return this.__call(`/merchant/payment/internal`, "POST", formData);
  }

  /**
   * * Cancel payment
   */
  public async cancelPayment(
    id: string | number
  ): Promise<ICancelPaymentResponse> {
    return this.__call(`/merchant/payment/internal/cancel/${id}`, "POST", null);
  }
}
