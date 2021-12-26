/**
 * @babel/preset-env 是一个语法包
 * 里面通过插件的方式组合
 */

const babel = require("@babel/core");
const code2 = `
function greet(input){
  return input ?? "Hello world";
}`

const result = babel.transformSync(code2, {
  targets: ">0.5%",
  presets: ["@babel/preset-env"]
})

console.log('result1 -->', result.code);

const code3 = `
// test class function

class Test {
  constructor(){
    this.x = 2
  }
}
`
const result2 = babel.transformSync(code3, {
  presets: ["@babel/preset-env"]
})

console.log("result2 -->", result2.code);
