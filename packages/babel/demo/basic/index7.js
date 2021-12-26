/**
 * 实际情况中，我们往往需要修改一大段代码
 * 我们可以使用 replaceWith 方法来替换旧的 ast 节点到新的 ast 节点
 */

const babelParser = require("@babel/parser");
const t = require("@babel/types");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const code8 = `
if (a == 2) {
  a += 1;
};
if (a != 0) {
  a = 0
}
`

const ast8 = babelParser.parse(code8, {});
traverse(ast8, {
  enter(path){
    if (t.isBinaryExpression(path.node) && path.node.operator === "==") {
      path.replaceWith(t.binaryExpression("===", path.node.left, path.node.right))
    } else if (t.isBinaryExpression(path.node, {operator: '!='})) {
      path.replaceWith(t.binaryExpression("!==", path.node.left, path.node.right))
    }
  }
})

const c2 = generator(ast8, {}).code;
console.log('result1 -->', c2);

let code2 = `
  let a  =2;
  console.log(2) ;
  console.info('hello world!');
`
const ast11 = babelParser.parse(code2, {});
traverse(ast11, {
  enter(path){
    if (t.isCallExpression(path) && t.isMemberExpression(path.node.callee)) {
      if (path.node.callee.object.name === 'console') {
        path.remove();
      }
    }
  }
})

const c11 = generator(ast11, {}).code;
console.log('result1 -->', c11);
