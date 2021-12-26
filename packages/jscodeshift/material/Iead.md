在工程的目录中通过查找和替换的功能或者通过 RegExp 来进行修改 JavaScript 文件，这是我们可以达到目的的一种方式。但是考虑到编写复杂的正则表达式，为什么不考虑通过使用脚本的方式来进行代码文件的修改呢。把开发同学从编写复杂、易错的正则工作中解放出来的方式就是 codemods。codemods 可以被看作是一种读写代码的脚本化查找和替换的功能。这里我们选择 jscodeshift 来完成这次的任务。

那么 jscodeshift 又是什么呢？ jscodeshift 在转化文件的时候先把源文件转化为抽象语法树（AST），然后我们可以进行一些符合预期的修改，然后把修改后的 AST 重新转换成源代码。

jscodeshift 提供一个包装器 recast 和 ast-types 包。recast 处理从源代码到 AST 的转换以及从 AST 重新生成源代码。ast-types 处理与 AST 节点的交互。

节点是 AST 的最基本的构建模块，我们可以通过可视化的网站

1. [AST Explorer](https://astexplorer.net/)
2. [TypeScript AST Viewer](https://ts-ast-viewer.com/)
   探索一下代码的节点内容。

首先看一个简单的例子，如何在代码中删除 console.log 。
首先通过

```JavaScript
const root = j(fileInfo.source)
const callExpressions = root.find(j.CallExpression)
```

获取一个包含根 AST 节点的路径的集合，然后通过 find 方法搜索后代节点，在这里就是查找方法调用的节点 CallExpression。这样粗粒度的查找并不符合我们的预期，所以我们需要加上特定的过滤内容

```JavaScript
const callExpressions = root.find(j.CallExpression, {
  callee: {
    type: 'MemberExpression',
    object: { type: 'Identifier', name: 'console' },
  },
});
```

现在我们可以准确的获取到 console 的代码，那么我们将其删除即可。

看完这个简单的例子，大家对前面提供到的 jscodeshift 的工作方式应该有了一定的了解了。接着我们再来看下黄金令箭迁移的脚本中的内容是怎么实现的。首先明确一下我们要做的事情，查找目标方法，把方法的名字替换，把当前的参数按照我们约定的格式切分成 c1,c2,c3,c4 对应黄金令箭上报的格式。

```JavaScript
const ast = root.find(j.CallExpression, {
  callee: {
    type: "Identifier",
    name: METHOD_NAME,
  },
});
```

首先还是获取目标的节点，这里也就是 sendGoldLog 方法，然后通过对这个节点的 identifier 进行修改，把方法修改成我们的目标方法。

```JavaScript
ast.find(j.Identifier, { name: METHOD_NAME }).forEach((path) => {
  j(path).replaceWith(j.identifier(TARGET_METHOD_NAME));
});
```

然后是对参数内容的修改，参数里有带有模板字符串的，有带有三目运算符的以及等等，这些我们都应该考虑。下面我们以这段代码为例子展开：

```JavaScript
sendGoldlog("one-service.test-submit", { queryType, isPhysSql: !!dbId, env });

armsLog({
  projectName: 'daas',
  businessDomain: 'one-service',
  moduleAndBehavior: 'test-submit',
  customConfig: JSON.stringify({ queryType, isPhysSql: !!dbId, env })
});
```
