/**
 * @author ccc1l
 * @description 创建文件夹、并且从 github 远程仓库获取模板文件
 */

const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const del = require("del");
const ora = require("ora");
const axios = require("axios");
const downloadRepo = require("download-git-repo");
const shell = require("shelljs");

const existDir = async (projectName) => {
  const currentDir = path.resolve("./");
  const fullDir = path.resolve(currentDir, `./${projectName}`);

  if (!fs.existsSync(fullDir)) {
    fs.mkdirSync(fullDir);
    return fullDir;
  }

  const res = await inquirer.prompt([
    {
      name: "createDir",
      type: "confirm",
      message: "dir has exist, can you overwrite?",
      default: true,
    },
  ]);

  if (res) {
    await del(fullDir, { force: true });

    fs.mkdirSync(fullDir);
    return fullDir;
  } else {
    console.log("create dir has been cancel");
    process.exit(1);
  }
};

const baseGitApi = "https://api.github.com";
let spinner = null;

/**
 *  获取仓库列表
 * @returns 返回对应的仓库数组
 */
const getReposList = async () => {
  spinner = ora("Loading repos...").start();

  let data;
  try {
    const result = await axios.get(`${baseGitApi}/users/hew007/repos`);
    data = result.data;
  } catch (error) {
    console.log("error-->", error);
  }

  spinner.succeed("Loading Success!");

  const reposNames = data
    .map((one) => one.name)
    .filter((item) => /tpl/.test(item));

  return reposNames;
};

/**
 * 根据仓库 获取tag列表
 * @param {string} repo
 * @returns
 */
const getReposTags = async (repo) => {
  spinner.text = "Loading tags...";
  spinner.start();

  let data;
  try {
    const result = await axios.get(`${baseGitApi}/repos/hew007/${repo}/tags`);
    data = result.data;
  } catch (error) {
    console.log("error-->", error);
  }

  spinner.succeed("Loading Success!");

  const reposTags = data.map((one) => one.name);

  return reposTags;
};

const main = async (projectName) => {
  const dir = await existDir(projectName);

  const repos = await getReposList();

  const { repo } = await inquirer.prompt([
    {
      name: "repo",
      type: "list",
      message: "choose a repo",
      choices: repos,
    },
  ]);

  const tags = await getReposTags(repo);
  const { tag } = await inquirer.prompt([
    {
      name: "tag",
      type: "list",
      message: "choose a tag",
      choices: tags,
    },
  ]);

  let downUrl = `hew007/${repo}/#`;
  if (tag) {
    downUrl += tag;
  }

  spinner.text = "download template ...";
  spinner.start();

  const destinationDir = path.resolve(dir, "./temp");

  downloadRepo(downUrl, destinationDir, (err) => {
    spinner.succeed("download success ");

    shell.cd(destinationDir);

    spinner.text = "install dependencies...";
    spinner.start();

    shell.exec("npm install");
    spinner.succeed();
  });
};

module.exports = main;
