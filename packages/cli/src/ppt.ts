import { Buffer } from 'node:buffer'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { JSDOM } from 'jsdom'
import { pptxToIdoc, useCustomDomParser } from 'modern-openxml'

const parser1 = new new JSDOM().window.DOMParser()

useCustomDomParser(
  (string, type) => {
    return parser1.parseFromString(string, type)
  },
)

export async function runPptCommand(filepath: string, options: any): Promise<void> {
  let {
    output = join(dirname(filepath), 'doc.json'),
    upload = false,
  } = options

  if (output === dirname(output)) {
    output = join(output, 'doc.json')
  }

  const outputDir = dirname(output)

  if (filepath.endsWith('.pptx')) {
    const idoc = await pptxToIdoc(
      readFileSync(filepath).buffer,
      {
        upload: (input, fill) => {
          const filename = fill.image
          if (upload) {
            const path = join(outputDir, filename)
            const dir = dirname(path)
            if (!existsSync(dir)) {
              mkdirSync(dir, { recursive: true })
            }
            writeFileSync(path, Buffer.from(input, 'base64'))
          }
          return filename
        },
      },
    )

    writeFileSync(output, JSON.stringify(idoc))
  }
  else if (filepath.endsWith('.json')) {
    // idoc to pptx
    // TODO
  }
  else {
    throw new Error('Only supported .pptx .json file')
  }
}
