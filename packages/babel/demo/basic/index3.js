/**
 * 遍历之后，我们需要大量的工具函数去进行类型判断
 * babel 给我们提供了一个巨大的工具类库 @babel/types
 * @babel/types 被包含在 @babel/core 的包里面
 */

const babelParser = require("@babel/parser");
const t = require("@babel/types");
const traverse = require("@babel/traverse").default;
const code6 = 'if (a == 2) {a+=1;}';
const ast6 = babelParser.parse(code6, {});

traverse(ast6, {
  enter(path) {
    if (t.isIdentifier(path.node)) {
      console.log(path.node);
    }
  }
})

traverse(ast6, {
  enter(path) {
    if (t.isBinaryExpression(path.node)){
      if(path.node.operator === '=='){
        console.log(path.node);
      }
    }
  }
})
