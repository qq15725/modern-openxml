import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/cli',
  ],
  declaration: true,
  failOnWarn: false,
  clean: false,
  rollup: {
    emitCJS: true,
  },
})
