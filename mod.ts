import { CaptureErr, Err, isErr } from "./deps.ts";

interface RequesterOptions {
  hostname: string;
  username: string;
  password: string;
  hash: string;
  searchParams: URLSearchParams;
  port: number;
  protocol: string;
  headers: HeadersInit;
  pathname: string;
  body?: string;
  requestInit?: RequestInit;
  method: string;
}

const RequestProtocolPortsMap = new Map<string, number>(Object.entries({
  http: 80,
  https: 443,
}));

const RequesterDefaultOptions: RequesterOptions = {
  hostname: "google.com",
  username: "",
  password: "",
  hash: "",
  headers: {},
  port: 443,
  protocol: "https",
  method: "GET",
  pathname: "",
  searchParams: new URLSearchParams(),
};

export class Requester {
  baseURL: URL;
  requestInit: RequestInit;
  constructor(options: Partial<RequesterOptions>) {
    const opts: RequesterOptions = { ...RequesterDefaultOptions, ...options };
    if (options.protocol && !options.port) {
      if (RequestProtocolPortsMap.has(options.protocol)) {
        if (opts.port !== RequestProtocolPortsMap.get(options.protocol)) {
          opts.port = RequestProtocolPortsMap.get(options.protocol)!;
        }
      }
    }
    const url = new URL(
      `${opts.protocol}://${opts.hostname}:${opts.port}`,
    );
    setURLParameters(url, options);
    this.baseURL = url;
    this.requestInit = opts.requestInit ?? {};
    this.requestInit.body = opts.body;
    this.requestInit.method = opts.method;
  }
  buildURL(pathname: string, options?: Partial<RequesterOptions>) {
    const path = this.baseURL.pathname.length > 0
      ? (this.baseURL.pathname.endsWith("/")
        ? this.baseURL.pathname
        : pathname
        ? this.baseURL.pathname + "/"
        : this.baseURL.pathname)
      : "";
    const url = new URL(this.baseURL);
    url.pathname = path + pathname;
    if (options) {
      setURLParameters(url, options);
    }
    return url;
  }
  async request(pathname: string, options?: Partial<RequesterOptions>) {
    const requestInit: RequestInit = {
      ...this.requestInit,
      ...options?.requestInit,
      body: this.requestInit.body ?? options?.body ??
        options?.requestInit?.body,
      headers: {
        ...this.requestInit.headers,
        ...options?.requestInit?.headers,
      },
    };
    const url = this.buildURL(pathname, options);
    return await CaptureErr(
      "Fetch Error",
      async () => await fetch(url, requestInit),
    );
  }
  // deno-lint-ignore ban-types
  async json<T extends object>(
    pathname: string,
    options?: Partial<RequesterOptions>,
  ) {
    const res = await this.request(pathname, options);
    if (isErr(res)) return res;
    const json = await CaptureErr(
      "JSON Error",
      async function JSON(): Promise<T> {
        return await res.json();
      },
    );
    return json;
  }
  // deno-lint-ignore ban-types
  async graphql<T extends object>(
    query: string,
  ): Promise<Err<"JSON Error"> | Err<"Fetch Error"> | T> {
    const res = await this.request("", {
      pathname: "graphql",
      requestInit: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      },
    });
    if (isErr(res)) return res;
    return CaptureErr("JSON Error", async () => await res.json());
  }
}

function setURLParameters(url: URL, options: Partial<RequesterOptions>) {
  url.hash = options.hash ?? url.hash;
  url.pathname = options.pathname ?? url.pathname;
  url.username = options.username ?? url.username;
  url.password = options.password ?? url.password;
  for (const [key, value] of options.searchParams?.entries() ?? []) {
    url.searchParams.set(key, value);
  }
}
