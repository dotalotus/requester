# Requester

Requester is a simple, flexible HTTP client for Deno. It provides an easy-to-use
interface for making HTTP requests and handling responses.

## Features

Supports all HTTP methods.

- Allows setting custom headers and query parameters.
- Supports error handling with CaptureErr.
- Provides a method for making GraphQL requests.
- Supports JSON responses.

## Installation

As Requester is a Deno module, you can import it directly from a URL in your
Deno scripts:

```ts
import { Requester } from "https://deno.land/x/requester/mod.ts";
```

## Usage

Here's a basic example of how to use Requester:

```ts
import { Requester } from "https://github.com/dotalotus/requester/mod.ts";

const client = new Requester({
  hostname: "api.example.com",
  protocol: "https",
});

const response = await client.request("/endpoint");
```

You can also set custom headers, query parameters, and other options:

```ts
const client = new Requester({
  hostname: "api.example.com",
  protocol: "https",
  headers: {
    "Authorization": "Bearer your_token",
  },
});

const response = await client.request("/endpoint", {
  searchParams: new URLSearchParams({
    "param1": "value1",
    "param2": "value2",
  }),
});
```
