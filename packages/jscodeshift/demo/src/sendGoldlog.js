/**
 * @author cc
 * @description jscodeshift 批量替换监控上报的 demo
 *
 * npx jscodeshift --extensions=js,jsx,ts,tsx --parser=tsx -t src/sendGoldlog.js  ./code
 */

const SPLIT_VALUE = {
  DOT: ".",
};

const METHOD_NAME = "sendGoldlog";

const TARGET_METHOD_NAME = "armsLog";

const PROJECT_NAME = "ccc1l";

const getNodeResult = (hasCustomConfig, result, j, node, argKeys) => {
  return hasCustomConfig
    ? result.concat(
        j.property(
          "init",
          j.identifier(argKeys[3]),
          j.callExpression(
            j.memberExpression(
              j.identifier("JSON"),
              j.identifier("stringify"),
              false
            ),
            node.arguments.slice(-1)
          )
        )
      )
    : result;
};

module.exports.parser = "tsx";

module.exports = function (file, api, options = {}) {
  const j = api.jscodeshift;
  const printOptions = options.printOptions || { quote: "single" };

  const root = j(file.source);

  const ast = root.find(j.CallExpression, {
    callee: {
      type: "Identifier",
      name: METHOD_NAME,
    },
  });

  // 找到名称为 sendGoldlog 的 Identifier，然后替换成一个新的 Identifier
  ast.find(j.Identifier, { name: METHOD_NAME }).forEach((path) => {
    j(path).replaceWith(j.identifier(TARGET_METHOD_NAME));
  });

  // 修改 sendGoldlog 的参数
  const argKeys = [
    "projectName",
    "businessDomain",
    "moduleAndBehavior",
    "customConfig",
  ];

  ast.replaceWith((nodePath) => {
    const { node } = nodePath;

    const argumentsAsObject = j.objectExpression(
      ...node.arguments.slice(0, 1).map((arg) => {
        const hasCustomConfig = node.arguments.length === 2;
        // 这里要注意区分 '' 字符串，以及 `` 模板字符串
        let targetString = "";

        if (arg.type === "TemplateLiteral") {
          targetString = arg.quasis[0].value.raw;
        } else if (arg.type === "Literal" || arg.type === "StringLiteral") {
          targetString = arg.value;
        } else if (arg.type === "ConditionalExpression") {
          // 条件表达式
          const consequent = arg.consequent.value;
          const alternate = arg.alternate.value;

          const [businessDomain, consequentModuleAndBehavior] = (
            consequent || ""
          ).split(SPLIT_VALUE.DOT);

          const [, alternateModuleAndBehavior] = (alternate || "").split(
            SPLIT_VALUE.DOT
          );

          // 区分 MemberExpression 和 BinaryExpression
          const isMemberExpression = arg.test.type === "MemberExpression";

          const result = [
            j.property(
              "init",
              j.identifier(argKeys[0], j.literal(PROJECT_NAME))
            ),
            j.property(
              "init",
              j.identifier(argKeys[1], j.literal(businessDomain))
            ),
            j.property(
              "init",
              j.identifier(argKeys[2]),
              j.conditionalExpression(
                isMemberExpression
                  ? j.memberExpression(
                      j.identifier(arg.test.object.name),
                      j.identifier(arg.test.property.name),
                      false
                    )
                  : j.binaryExpression(
                      "===",
                      j.identifier(arg.test.left.name),
                      j.memberExpression(
                        j.identifier(arg.test.right.object.name),
                        j.identifier(arg.test.right.property.name),
                        false
                      )
                    ),
                j.identifier(`"${consequentModuleAndBehavior}"`),
                j.identifier(`"${alternateModuleAndBehavior}"`)
              )
            ),
          ];

          return getNodeResult(hasCustomConfig, result, j, node, argKeys);
        }

        const [businessDomain, moduleAndBehavior] = targetString.split(
          SPLIT_VALUE.DOT
        );

        const result = [
          j.property("init", j.identifier(argKeys[0]), j.literal(PROJECT_NAME)),
          j.property(
            "init",
            j.identifier(argKeys[1]),
            j.literal(businessDomain)
          ),
          j.property(
            "init",
            j.identifier(argKeys[2]),
            j.literal(moduleAndBehavior)
          ),
        ];

        return getNodeResult(hasCustomConfig, result, j, node, argKeys);
      })
    );

    node.arguments = [argumentsAsObject];
    return node;
  });
  return root.toSource(printOptions);
};
