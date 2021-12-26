/**
 * 生成的代码都通过 ast 表达式来写的话有点不合适
 * 代码模板 @babel/template 可以直接生成 ast
 * @babel/template 被包含在 @babel/core 里面
 * 代码模板生成的是抽象语法树，如果我们编写注释，那么最后生成的代码是没有注释的
 */

const babelTemplate = require("@babel/template");
const t = require("@babel/types");
const generator = require("@babel/generator").default;

const requireTemplate = babelTemplate.default(`
  const IMPORT_NAME = require(IMPORT_PATH);
`)

const ast9 = requireTemplate({
  IMPORT_NAME: t.identifier("babelTemplate"),
  IMPORT_PATH: t.stringLiteral("@babel/template")
})

console.log('result1 -->', generator(ast9, {}).code);
