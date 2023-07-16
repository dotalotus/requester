import { CaptureErr, isErr } from "./deps.ts";

export class Requester {
  public url: URL;
  public headers: Headers;
  constructor(baseURL: string | URL, private requestInit: RequestInit = {}) {
    this.url = typeof baseURL === "string"
      ? new URL(baseURL.endsWith("/") ? baseURL : baseURL + "/")
      : baseURL;
    this.headers = new Headers(requestInit.headers);
  }
  private buildURL(path: string, searchParams: Record<string, string> = {}) {
    const url = new URL(path, this.url);
    for (const key in searchParams) {
      url.searchParams.set(key, searchParams[key]);
    }
    return url;
  }
  private concatSearchParams(searchParams: URLSearchParams) {
    for (const [key, value] of this.url.searchParams.entries()) {
      if (!searchParams.has(key)) searchParams.set(key, value);
    }
  }
  private concatHeaders(requestInitHeaders: HeadersInit): HeadersInit {
    const headers = this.headers;
    if (this.requestInit.headers !== undefined) {
      for (const [key, value] of Object.entries(this.requestInit.headers)) {
        headers.set(key, value);
      }
    }
    for (const [key, value] of Object.entries(requestInitHeaders)) {
      headers.set(key, value);
    }
    return {
      ...this.requestInit.headers,
      ...requestInitHeaders,
      ...headers.entries(),
    };
  }
  public fetch(
    path: string | URL,
    searchParams: Record<string, string> = {},
    requestInit: RequestInit = {},
  ) {
    const url: URL = path instanceof URL ? path : this.buildURL(
      path.startsWith("/") ? path.slice(1) : path,
      searchParams,
    );
    this.concatSearchParams(url.searchParams);
    requestInit.headers = this.concatHeaders(requestInit.headers ?? {});
    return CaptureErr("Fetch Error", () => fetch(url, requestInit));
  }
  public async json<T = {}>(
    path: string | URL,
    searchParams: Record<string, string> = {},
    requestInit: RequestInit = {},
  ) {
    const res = await this.fetch(path, searchParams, requestInit);
    if (isErr(res)) {
      return res;
    }
    return CaptureErr("JSON Error", (): Promise<T> => res.json());
  }
}
