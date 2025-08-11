import consola from 'consola'
import { createCli } from './create-cli'

// eslint-disable-next-line node/prefer-global/process
createCli({ cwd: process.cwd() })
  .runMatchedCommand()
  ?.catch((err: unknown) => {
    consola.error(err)
    // eslint-disable-next-line node/prefer-global/process
    process.exitCode = 1
  })
