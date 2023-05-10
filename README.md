# Streaming SSR Demo

This is a demo showcasing how streaming SSR in React works.

In this demo each step in the SSR + Hydration process is able to be blocked/unblocked manually, so that we can observe how streaming SSR interacts with each of these steps.

To build this demo I had to run A LOT OF hacks/advanced features like:

- eval
- writeSync
- SharedArrayBuffer
- Web Workers
- Worker Threads
- Manually resolving promises
- Supressing hydration mismatches
- Server-sent events

So this demo is not meant to be used as a reference for how to do streaming SSR in React, but rather as a way to understand how streaming SSR works.

Eventually I might write a post explaining the rationale behind this demo.

## Branches

Disregard the `master` branch, it's just a placeholder for this README.

There are 2 important branches:

- `old-ssr`: Implements SSR **without** streaming.
- `streaming-ssr`: Implements streaming SSR.

## How to run

Run `npm run dev`.
