- **Type:** `boolean`
- **Default:** `false`

When a port is occupied, Rsbuild will automatically increment the port number until an available port is found.

Set `strictPort` to `true` and Rsbuild will throw an exception when the port is occupied.

### Example

```ts
export default {
  server: {
    strictPort: true,
  },
};
```
