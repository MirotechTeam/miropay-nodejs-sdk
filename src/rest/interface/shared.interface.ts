import { IncomingHttpHeaders } from "undici/types/header";

// ** ============================= Http ============================ ** //
export interface IHttpResponse<T> {
  data: T;
  body: Record<any, any>;
  headers: IncomingHttpHeaders;
  statusCode: number;
}
