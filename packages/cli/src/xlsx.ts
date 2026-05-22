import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { JSDOM } from 'jsdom'
import { jsonToXlsx, useCustomDomParser, xlsxToJson } from 'modern-openxml'

const parser1 = new new JSDOM().window.DOMParser()

useCustomDomParser(
  (string, type) => {
    return parser1.parseFromString(string, type)
  },
)

export async function runXlsxCommand(filepath: string, options: any): Promise<void> {
  let {
    output = join(dirname(filepath), 'workbook.json'),
  } = options

  const outputDir = dirname(output)

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  if (filepath.endsWith('.xlsx')) {
    const workbook = await xlsxToJson(readFileSync(filepath))

    if (!output.endsWith('.json')) {
      output = join(output, 'workbook.json')
    }

    writeFileSync(output, JSON.stringify(workbook))
  }
  else if (filepath.endsWith('.json')) {
    if (!output.endsWith('.xlsx')) {
      output = join(output, 'output.xlsx')
    }

    writeFileSync(output, await jsonToXlsx(
      JSON.parse(readFileSync(filepath, 'utf8')),
    ))
  }
  else {
    throw new Error('Only supported .xlsx .json file')
  }
}
