/**
 * babel 解析器
 * 1. 使用 @babel/core
 * 2. 使用 @babel/parser
 */

const code2 = `
function greet(input){return input ?? "Hello word";}`;

// 1. 使用 @babel/core 的 transformSync 方法
const babel = require("@babel/core");
const result1 = babel.transformSync(code2, {ast: true});

console.log('result 1 -->', result1);

// 2. 使用 @babel/core 的 parseSync 方法
const result2 = babel.parseSync(code2);

console.log('result2 -->', result2);

//3 . 使用 @babel/parser 的 parse， @babel/parser 被包含在 @babel/core 里面
const babelParser = require("@babel/parser");
const result3 = babelParser.parse(code2, {});

console.log('result3 -->', result3);
