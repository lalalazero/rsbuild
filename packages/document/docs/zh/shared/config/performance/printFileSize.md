- **类型：**

```ts
type PrintFileSizeOptions =
  | {
      /**
       * 是否输出所有静态资源文件的总体积
       */
      total?: boolean;
      /**
       * 是否输出每个静态资源文件的体积
       */
      detail?: boolean;
    }
  | boolean;
```

- **默认值：** `true`

是否在生产环境构建后输出所有静态资源文件的体积。

如果是 Boolean 类型，将根据配置决定是否输出所有静态资源文件的体积，默认输出如下。

```bash
info    Production file sizes:

  File                                    Size        Gzipped
  dist/static/js/lib-react.b0714b60.js    140.4 kB    45.0 kB
  dist/static/js/index.f3fde9c7.js        1.9 kB      0.97 kB
  dist/index.html                         0.39 kB     0.25 kB
  dist/static/css/index.2960ac62.css      0.35 kB     0.26 kB

  Total size:  143.0 kB
  Gzipped size:  46.5 kB
```

你也可以通过 Object 类型分别对输出所有静态资源文件的体积和以及输出每个静态资源文件的体积进行配置。

如果你不想输出每个静态资源文件的体积，可以：

```ts
export default {
  performance: {
    printFileSize: {
      detail: false,
    },
  },
};
```

如果你不想输出任何信息，可以将 `printFileSize` 置为 `false` 将其禁用掉：

```ts
export default {
  performance: {
    printFileSize: false,
  },
};
```
