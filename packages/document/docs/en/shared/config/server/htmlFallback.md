- **Type:** `false | 'index'`
- **Default:** `'index'`

Whether to support html fallback. By default, when the request meets the following conditions and the corresponding resource is not found, it will fallback to `index.html`:

- The request is a `GET` or `HEAD` request
- Which accepts `text/html` (the request header accept type is `text/html` or `*/*`)

```js
export default {
  server: {
    htmlFallback: 'index',
  },
};
```

:::tip
When htmlFallback cannot meet your needs, you can use [server.historyApiFallback](/config/options/server#serverhistoryapifallback) for more flexible settings.
:::
