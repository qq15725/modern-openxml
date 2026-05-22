import type { CAC } from 'cac'
import type { Options } from './types'
import { cac } from 'cac'
import { bin, version } from '../package.json'
import { runDocxCommand } from './docx'
import { runPptCommand } from './ppt'
import { runXlsxCommand } from './xlsx'

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
    .command('xlsx [filepath]', 'Parse XLSX to JSON, parse JSON to XLSX.')
    .option('-o, --output [output-path]', 'Output file or directory')
    .action(async (filepath, options) => {
      runXlsxCommand(filepath, options)
    })

  cli
    .command('docx [filepath]', 'Parse DOCX to JSON, parse JSON to DOCX.')
    .option('-o, --output [output-path]', 'Output file or directory')
    .action(async (filepath, options) => {
      runDocxCommand(filepath, options)
    })

  cli
    .help()
    .version(version)
    // eslint-disable-next-line node/prefer-global/process
    .parse(process.argv, { run: false })

  return cli
}
