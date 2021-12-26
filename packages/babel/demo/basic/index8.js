/**
 * 支持作用域分析
 * 1. 通过 path.scope.hasBinding(name) 来判断在这个作用域中是否存在某个变量
 * 2. 通过 path.scope.hasGlobal(name) 来判断在这个作用域中是否存在全局变量
 * 3. 通过 path.scope.getBinding(name) 来获取某个变量的绑定信息
 * 
 * 在 functionDeclaration 中，函数内部定义的 a 开始被绑定，且初始值为 0
 */

const babelParser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const code13 = `
g = 1;
function test() {
  let a = 0;
  for(let i = 0; i < 10; i++) {
    a += i;
  }
}`;

const ast13 = babelParser.parse(code13, {});
traverse(ast13, {
  enter(path) {
    console.log(path.type);
    const is_a = path.scope.hasBinding('a');
    console.log(is_a);
    if (is_a) {
      console.log(path.scope.getBinding('a').path.node.init.value);
    }
    console.log(path.scope.hasGlobal('g'));
  }
})
