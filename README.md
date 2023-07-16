# Requester

Requester is a simple, flexible HTTP client for Deno. It provides an easy-to-use
interface for making HTTP requests and handling responses.

## Features

Supports all HTTP methods.

- Allows setting custom headers and query parameters.
- Supports error handling with EAV.
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

const client = new Requester("https://api.example.com/");

const response = await client.fetch("/endpoint");
```

You can also set custom headers, query parameters, and other options:

```ts
const client = new Requester("https://api.example.com/", {
  headers: {
    "Authorization": "Bearer your_token"
  }
});

const response = await client.fetch("/added_pathname", {
  param1: "value1",
  param2: "value2"
})
```
A requester might exist for an API library, so you can adjust it's base settings as needed.

```ts
import { client } from "somelibrary";
// a requester might exist for an api library
client.url.host = "api.otherexample.com"
client.url.protocol = "http";

const response = await client.fetch('/this/is/the/path')
console.log(response)
```
