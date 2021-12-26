import { declare} from '@babel/helper-plugin-utils';

export default declare(api => {
  api.assertVersion(7);

  // types 就是 @babel/types
  // template  就是 @babel/template
  const {types, template } = api;

  // 定义一个变量，用来存储所有变化之后的结果，最后将这个节点赋值给 body
  const bodyContent = [];

  // 通过策略模式对每一个 property 做基础写法的转换
  function genDefineProps(property){
    return types.variableDeclaration('const', [
      types.variableDeclarator(
        types.identifier('props'),
        types.callExpression(types.identifier('defineProps'), [property.value])
      )
    ])
  }

  function genReactiveData(property){

  }

  function genComputed(property){

  }

  function genWatcher(property){

  }

  function genMethods(property){

  }

  function genBeforeUnmount(property){

  }
  return {
    name: 'transform-options-to-composition',
    visitor: {
      // 访问者模式，访问到 type = 'Program' 的节点，就会调用 visitor.Program
      Program(path){
        // 通过 types.isExportDefaultDeclaration 这个方法判断是否是 export default
        const exportDefaultDeclaration = path.node.body.filter((item) => {
          return types.isExportDefaultDeclaration(item);
        })

        const properties = exportDefaultDeclaration[0].declaration.properties;

        const GEN_MAP = {
          props: genDefineProps,
          data: genReactiveData,
          computed: genComputed,
          watch: genWatcher,
          methods: genMethods,
          beforeUnmount: genBeforeUnmount
        }

        properties.forEach((property) => {
          const keyName = property.key.name;
          const newNode = GEN_MAP?.[keyName]?.(property);

          if (newNode) {
            Array.isArray(newNode) ? bodyContent.push(...newNode) : bodyContent.push(newNode);
          }
        })

        path.node.body = bodyContent;
      }
    }
  }
})
