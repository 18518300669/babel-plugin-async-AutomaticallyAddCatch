const DEFAULT = {
  catchCode: (identifier) => `console.error(${identifier})`,
  identifier: 'e',
  finallyCode: null,
};

/**
 * 参数满足含有 async 关键字的
 * 函数声明
 * 箭头函数
 * 函数表达式
 * 方法
 * 则返回 true
 * **/

const isAsyncFuncNode = (node, t) =>
  t.isFunctionDeclaration(node, {
    async: true,
  }) ||
  t.isArrowFunctionExpression(node, {
    async: true,
  }) ||
  t.isFunctionExpression(node, {
    async: true,
  }) ||
  t.isObjectMethod(node, {
    async: true,
  });

/**
 *  只给最外层的 async 函数包裹 try/catch
 * **/
export default ({ types: t, parse }) => {
  return {
    visitor: {
      AwaitExpression(path, { opts }) {
        const options = {
          ...DEFAULT,
          ...opts,
        };
        if (typeof options.catchCode === 'function') {
          options.catchCode = options.catchCode(options.identifier);
        }
        let catchNode = parse(options.catchCode).program.body;
        let finallyNode =
          options.finallyCode && parse(options.finallyCode).program.body;

        // 递归向上找异步函数的 node 节点
        while (path && path.node) {
          let parentPath = path.parentPath;
          if (
            // 找到 async Function
            t.isBlockStatement(path.node) &&
            isAsyncFuncNode(parentPath.node, t)
          ) {
            let tryCatchAst = t.tryStatement(
              path.node,
              t.catchClause(
                t.identifier(options.identifier),
                t.blockStatement(catchNode)
              ),
              finallyNode && t.blockStatement(finallyNode)
            );
            path.replaceWithMultiple([tryCatchAst]);
            return;
          } else if (
            // 已经包含 try 语句则直接退出
            t.isBlockStatement(path.node) &&
            t.isTryStatement(parentPath.node)
          ) {
            return;
          }
          path = parentPath;
        }
      },
    },
  };
};
