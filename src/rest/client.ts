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
import { ICreatePayment } from "./interface/client.interface";

export class PaymentRestClient {
  private readonly upstreamVersion: number = 1;
  private readonly dispatcher: Dispatcher;
  private readonly authenticator: PrivateKeyAuthenticator;
  private readonly baseUrl: string = "";

  constructor(key: string, secret: string, host: string) {
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

    this.baseUrl = host;
  }

  public async __call(
    path: string,
    verb: Dispatcher.HttpMethod,
    body: string | Buffer | Uint8Array | Readable | null | FormData
  ) {
    const v = `/v${this.upstreamVersion}`;
    const versionedUrl = this.baseUrl + v + path;
    const signature = this.authenticator.makeSignature(verb, path);

    return request(versionedUrl, {
      dispatcher: this.dispatcher,
      method: verb,
      body: body,
      headers: { "x-signature": signature, "x-id": this.authenticator.keyId },
    });
  }

  /**
   * * Get payment by id
   */
  public async getById(id: string | number) {
    return this.__call(`/merchant/payment/internal/${id}`, "GET", null);
  }

  /**
   * * Create payment
   */
  public async createPayment(payload: ICreatePayment) {
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
  public async cancelPayment(id: string | number) {
    return this.__call(`/merchant/payment/internal/cancel/${id}`, "POST", null);
  }
}
