- **类型：**

```js
Array<
  (
    middlewares: {
      unshift: (...handlers: RequestHandler[]) => void;
      push: (...handlers: RequestHandler[]) => void;
    },
    server: {
      sockWrite: (
        type: string,
        data?: string | boolean | Record<string, any>,
      ) => void;
    },
  ) => void
>;
```

- **默认值：** `undefined`

提供执行自定义函数和应用自定义中间件的能力。

中间件的执行顺序是: `unshift` => 内置中间件 => `push`。

```js
export default {
  dev: {
    setupMiddlewares: [
      (middlewares, server) => {
        middlewares.unshift((req, res, next) => {
          next();
        });

        middlewares.push((req, res, next) => {
          next();
        });
      },
    ],
  },
};
```

一些特殊场景需求可能需要使用服务器 API：

- sockWrite。允许向 hmr 客户端传递一些消息，hmr 客户端将根据接收到的消息类型进行不同的处理。如果你发送一个 "content-changed " 的消息，页面将会重新加载。

```js
export default {
  dev: {
    setupMiddlewares: [
      (middlewares, server) => {
        // 添加自定义 watcher 并在文件更新时触发页面刷新
        watcher.on('change', (changed) => {
          server.sockWrite('content-changed');
        });
      },
    ],
  },
};
```
