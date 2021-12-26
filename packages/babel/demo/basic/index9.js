/**
 * babel 还提供了一个 code frame 的功能来标记代码，让出错的信息可读性更好
 * @babel/code-frame 也被包含在 @bebel/core 里面
 */

const codeFrame = require("@babel/code-frame");
const rawLine2 = `let a = isNaN(b);`

const result2 = codeFrame.codeFrameColumns(rawLine2, {
  start: {line: 1, column: 9 },
  end: {line: 1, column: 14}
},
{
  highlightCode: true
})

console.log('result2 -->', result2);

const rawLine3 = ['class CodeAnalyzer {', ' constructor()', '};'].join('\n');
const result3 = codeFrame.codeFrameColumns(rawLine3, {
  start: {line: 2, column: 3 },
  end: {line: 2, column: 16}
},
{
  highlightCode: true
})

console.log('result3 -->', result3);
