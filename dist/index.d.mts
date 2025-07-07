import { Dispatcher } from 'undici';

declare class PaymentRestClient {
    private readonly upstreamVersion;
    private readonly dispatcher;
    private readonly authenticator;
    constructor(key: string, secret: string, host: string);
    private __call;
    getById(id: string | number): Promise<Dispatcher.ResponseData<null>>;
}

export { PaymentRestClient };
