## jscodeshift 网址

https://github.com/facebook/jscodeshift

## 代码自动化重构利器——jscodeshift 初探

https://juejin.cn/post/6934911685220106253

## 重构神器 jscodeshift

https://juejin.cn/post/6986078453917302815

通过 husky 在 commit 钩子上添加 npx jscodeshift -t remove_console.js ，解决 eslint 根据 eslint 报错信息定位到指定文件，然后将 console 删掉，重新 git add -> git commit。

## jscodeshift 入门指南

https://tianqi.name/blog/2018/01/12/jscodeshift.html

## jscodeshift 简易教程

https://www.cnblogs.com/axes/p/7694041.html


## Write Code to Rewrite Your Code: jscodeshift

https://www.toptal.com/javascript/write-code-to-rewrite-your-code

``` JavaScript
// 很好的例子的文章，下面是关于 object 操作的示例代码
return root.find(j.CallExpression, {
    callee: {
    type: 'MemberExpression',
    object: {
        name: localName,
    },
    property: {
        name: 'factory',
    },
    }
})
.replaceWith(nodePath => {
    const { node } = nodePath;

    // use a builder to create the ObjectExpression
    const argumentsAsObject = j.objectExpression(

    // map the arguments to an Array of Property Nodes
    node.arguments.map((arg, i) =>
        j.property(
        'init',
        j.identifier(argKeys[i]),
        j.literal(arg.value)
        )
    )
    );

    // replace the arguments with our new ObjectExpression
    node.arguments = [argumentsAsObject];

    return node;
})
```