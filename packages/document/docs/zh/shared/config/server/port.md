- **类型：** `number`
- **默认值：** `8080`

设置 Rsbuild Server 监听的端口号。

默认情况下，Rsbuild Server 会监听 8080 端口，并在端口被占用时自动递增端口号。

你可以使用 `server.port` 配置或 `--port` 参数来设置端口号 (`--port` 参数的优先级高于 `server.port` 配置)。

### 示例

将端口设置为 `3000`：

```ts
export default {
  server: {
    port: 3000,
  },
};
```
