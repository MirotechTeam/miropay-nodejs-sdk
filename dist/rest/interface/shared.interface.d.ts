import { IncomingHttpHeaders } from "undici/types/header";
export interface IHttpResponse<T> {
    body: T;
    headers: IncomingHttpHeaders;
    statusCode: number;
}
