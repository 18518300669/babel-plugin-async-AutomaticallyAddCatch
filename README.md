```javascript
// .babel.rc

plugins: [
  [
    'async-AutomaticallyAddCatch',
    {
      catchCode: `alert(e)`,
    },
  ],
];
```

## Options

|       Name        |    Type    |       Default        | Description                    |
| :---------------: | :--------: | :------------------: | :----------------------------- |
| **`identifier`**  | `{string}` |        `"e"`         | `catch 子句中的错误对象标识符` |
|  **`catchCode`**  | `{string}` | `"console.error(e)"` | `catch 子句中的代码片段`       |
| **`finallyCode`** | `{string}` |     `undefined`      | `finally 子句中的代码片段`     |
