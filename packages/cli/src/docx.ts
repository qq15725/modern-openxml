import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { JSDOM } from 'jsdom'
import { docxToJson, jsonToDocx, useCustomDomParser } from 'modern-openxml'

const parser1 = new new JSDOM().window.DOMParser()

useCustomDomParser(
  (string, type) => {
    return parser1.parseFromString(string, type)
  },
)

export async function runDocxCommand(filepath: string, options: any): Promise<void> {
  let {
    output = join(dirname(filepath), 'document.json'),
  } = options

  const outputDir = dirname(output)

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  if (filepath.endsWith('.docx')) {
    const doc = await docxToJson(readFileSync(filepath))

    if (!output.endsWith('.json')) {
      output = join(output, 'document.json')
    }

    writeFileSync(output, JSON.stringify(doc))
  }
  else if (filepath.endsWith('.json')) {
    if (!output.endsWith('.docx')) {
      output = join(output, 'output.docx')
    }

    writeFileSync(output, await jsonToDocx(
      JSON.parse(readFileSync(filepath, 'utf8')),
    ))
  }
  else {
    throw new Error('Only supported .docx .json file')
  }
}
