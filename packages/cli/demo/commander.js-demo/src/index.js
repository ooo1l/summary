const path = require("path");
const { program } = require("commander");

// 定义命令参数对象
const actions = {
  // create命令
  create: {
    alias: "ct",
    desc: "create a project",
  },
  // 删除命令
  delete: {
    alias: "del",
    desc: "delete a file form path",
  },
  // 其他的命令处理
  "*": {
    alias: "",
    desc: "command not found",
  },
};

// 遍历 actions 配置命令
Object.keys(actions).forEach((key) => {
  program
    // 定义命令字段
    .command(key)
    // 定义别名 delete =》 del
    .alias(actions[key].alias)
    // 定义描述
    .description(actions[key].desc)
    .action((source, destination) => {
      if (key === "*") {
        console.log(actions[key].desc);
      } else {
        // 向 create.js 和 delete.js 传递参数
        // 对应 actions 文件夹下的名称
        // 取第四个参数之后的参数
        require(path.resolve(__dirname, `./actions/${key}`))(
          process.argv.slice(3)
        );
      }
    });
});

program.parse(process.argv);
