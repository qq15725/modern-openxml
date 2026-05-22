// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
  },
  {
    rules: {
      // OoxmlNode.find() 是类 querySelector 的自定义方法(返回节点或 undefined),
      // 并非 Array.prototype.find,没有对应的 .some(),该规则在此为误报。
      'e18e/prefer-array-some': 'off',
    },
  },
)
