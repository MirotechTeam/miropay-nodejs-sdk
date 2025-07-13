import { IncomingHttpHeaders } from "undici/types/header";

// ** ============================= Http ============================ ** //
export interface IHttpResponse<T> {
  body: T;
  headers: IncomingHttpHeaders;
  statusCode: number;
}
