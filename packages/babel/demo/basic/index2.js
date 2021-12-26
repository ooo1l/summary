/**
 * 提供 @babel/traverse 包来辅助遍历抽象语法树
 * @babel/traverse 被包含在 @babel/core 的包里面
 */

const babelParser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const code4 = 'let a  = 2 ** 8;';
const ast4 = babelParser.parse(code4, {}); 

traverse(ast4, {
  enter(path) {
    console.log(path.type);
  }
})
