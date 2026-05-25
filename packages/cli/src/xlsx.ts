import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { JSDOM } from 'jsdom'
import { docToXlsx, useCustomDomParser, xlsxToDoc } from 'modern-openxml'

const parser1 = new new JSDOM().window.DOMParser()

useCustomDomParser(
  (string, type) => {
    return parser1.parseFromString(string, type)
  },
)

export async function runXlsxCommand(filepath: string, options: any): Promise<void> {
  let {
    output = join(dirname(filepath), 'doc.json'),
  } = options

  const outputDir = dirname(output)

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  if (filepath.endsWith('.xlsx')) {
    const idoc = await xlsxToDoc(readFileSync(filepath))

    if (!output.endsWith('.json')) {
      output = join(output, 'output.json')
    }

    writeFileSync(output, JSON.stringify(idoc))
  }
  else if (filepath.endsWith('.json')) {
    if (!output.endsWith('.xlsx')) {
      output = join(output, 'output.xlsx')
    }

    writeFileSync(output, await docToXlsx(
      JSON.parse(readFileSync(filepath, 'utf8')),
    ))
  }
  else {
    throw new Error('Only supported .xlsx .json file')
  }
}
