/**
 * @author cc
 * @description jscodeshift cli 的 modify 方法
 */
const shell = require("shelljs");

const main = async () => {
  console.log("modify");

  shell.exec(
    "npx jscodeshift --extensions=js,jsx,ts,tsx --parser=tsx -t src/core/sendGoldlog.js  ./code"
  );
};
module.exports = main;
