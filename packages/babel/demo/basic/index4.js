/**
 * @babel/type 更主要的作用是生成 ast node
 * @babel/generator 可以根据 ast 直接生成 code， 这个包也是一样被包含在 @babel/core 里面
 */

const t = require("@babel/types");
const babelParser =  require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const node7 = t.binaryExpression("==", t.identifier("a"), t.numericLiteral(0));
node7.operator = "===";

console.log("result1 -->", node7);

const code8 = 'if (a == 2) {a+=1;}';
const ast8 = babelParser.parse(code8, {});
traverse(ast8, {
  enter(path) {
    if(t.isBinaryExpression(path.node)){
      if(path.node.operator === '=='){
        path.node.operator = '===';
      }
   }
  }
})

const c2 = generator(ast8, {}).code;
console.log("result2 -->", c2);
