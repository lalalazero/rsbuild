- **Type:** `number`
- **Default:** `8080`

Specify a port number for Rsbuild Server to listen.

By default, Rsbuild Server listens on port `8080` and automatically increments the port number when the port is occupied.

You can use `server.port` or the `--port` CLI param to set the port number (The priority of `--port` option is higher than `server.port`).

### Example

Set the port to `3000`:

```ts
export default {
  server: {
    port: 3000,
  },
};
```
