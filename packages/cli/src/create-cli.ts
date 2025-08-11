import type { CAC } from 'cac'
import type { Options } from './types'
import { cac } from 'cac'
import { bin, version } from '../package.json'
import { runPptCommand } from './ppt'

export function createCli(_options: Options): CAC {
  const cli = cac(Object.keys(bin)[0])

  cli
    .command('ppt [filepath]', 'Parse PPTX to JSON, parse JSON to PPTX.')
    .option('-o, --output [output-path]', 'Output file or directory')
    .option('-u, --upload', 'Upload ref files to output directory')
    .action(async (filepath, options) => {
      runPptCommand(filepath, options)
    })

  cli
    .help()
    .version(version)
    // eslint-disable-next-line node/prefer-global/process
    .parse(process.argv, { run: false })

  return cli
}
