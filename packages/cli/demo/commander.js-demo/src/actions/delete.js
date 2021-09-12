const path = require("path");
const del = require("del");

const handleDelFn = async (name) => {
  const dir = path.resolve(`./${name}`);
  console.log("need delete dir:", dir);

  await del(dir);
};

const main = (args) => {
  console.log("args:", args); // ['dir']
  handleDelFn(args[0]);
};

module.exports = main;
