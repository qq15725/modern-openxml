import type { Source } from './types'
import Jszip from 'jszip'
import { ContentTypes } from '../ContentTypes'
import { App } from '../doc-props/App'
import { Core } from '../doc-props/Core'
import { Relationship } from '../Relationship'
import { Theme } from '../Theme'
import { clearUndefProp, compressXml, withXmlHeader } from '../utils'
import { createVNode } from '../vnode'
import { SharedStrings } from './SharedStrings'
import { Sheet } from './Sheet'
import { Styles } from './Styles'
import { Workbook } from './Workbook'

interface XlsxProps {
  width?: number
  height?: number
  sheets: (ReturnType<typeof Sheet.parse> & { name: string | undefined })[]
}

export class XLSX {
  parse(source: Source) {
    const jszip = new Jszip()
    const zip = await jszip.loadAsync(source)
    const read = async (path: string, type: 'base64' | 'string' = 'string') => {
      if (path.startsWith('/'))
        path = path.substring(1)
      return zip.files[path]?.async(type)
    }

    const getRelsPath = (path = '') => {
      const paths = path.split('/')
      const last = paths.length - 1
      return [...paths.slice(0, last), '_rels', `${paths[last]}.rels`].join('/')
    }

    // [Content_Types].xml
    const contentTypes_ = await read('[Content_Types].xml')
    const contentTypes = ContentTypes.parse(createVNode(contentTypes_?.replace(/xmlns=".+?"/g, '')))

    // _rels/.rels
    const relationshipsPath = getRelsPath()
    const relationships_ = await read(relationshipsPath)
    const relationships = Relationship.parse(
      createVNode(relationships_?.replace(/xmlns=".+?"/g, '')),
      relationshipsPath,
      contentTypes,
    )

    // xl/workbook.xml
    const workbookPath = relationships.find(v => v.type === 'workbook')?.path
    if (!workbookPath)
      return undefined
    const workbookNode = createVNode((await read(workbookPath))?.replace(/xmlns=".+?"/g, ''))
    const workbook = Workbook.parse(workbookNode)

    // xl/_rels/workbook.xml.rels
    const workbookRelsPath = getRelsPath(workbookPath)
    const workbookRels_ = await read(workbookRelsPath)
    const workbookRels = Relationship.parse(
      createVNode(workbookRels_?.replace(/xmlns=".+?"/g, '')),
      workbookRelsPath,
      contentTypes,
    )

    // xl/sharedStrings.xml
    let sharedStrings: string[] = []
    const sharedStringsPath = workbookRels.find(v => v.type === 'sharedStrings')?.path
    if (sharedStringsPath) {
      const sharedStringsContent = await read(sharedStringsPath)
      const sharedStringsNode = createVNode(sharedStringsContent?.replace(/xmlns=".+?"/g, ''))
      sharedStrings = SharedStrings.parse(sharedStringsNode)
    }

    const props: XlsxProps = {
      width: workbook?.width,
      height: workbook?.height,
      sheets: [],
    }

    for (const sheetItem of workbook.sheets) {
      const sheetPath = workbookRels.find(v => v.id === sheetItem.rid)?.path
      if (!sheetPath)
        continue
      const sheet = createVNode((await read(sheetPath))?.replace(/xmlns=".+?"/g, ''))
      const sheetProps = Sheet.parse(sheet, sharedStrings)
      props.sheets.push({
        name: sheetItem.name,
        ...sheetProps,
      })
    }

    return clearUndefProp(props)
  }

  generate(props: XlsxProps) {
    const zip = new Jszip()
    const addXmlFile = (path: string, content: string) => zip.file(path, compressXml(withXmlHeader(content)))

    // docProps
    addXmlFile('docProps/app.xml', App.stringify())
    addXmlFile('docProps/core.xml', Core.stringify())

    // styles
    addXmlFile('xl/styles.xml', Styles.stringify())

    // theme
    addXmlFile('xl/theme/theme1.xml', Theme.stringify())

    // worksheets
    const sheets: string[] = []
    props.sheets.forEach((sheet, index) => {
      const number = index + 1
      addXmlFile(`xl/worksheets/sheet${number}.xml`, Sheet.stringify(sheet as any))
      sheets.push(`worksheets/sheet${number}.xml`)
    })

    // sharedStrings
    addXmlFile('xl/sharedStrings.xml', SharedStrings.stringify())

    // workbook
    addXmlFile('xl/workbook.xml', Workbook.stringify(props as any))
    addXmlFile('xl/_rels/workbook.xml.rels', Relationship.stringify([
      ...sheets,
      'sharedStrings.xml',
      'styles.xml',
      'theme/theme1.xml',
    ]))

    // rels
    addXmlFile('_rels/.rels', Relationship.stringify([
      'xl/workbook.xml',
      'docProps/app.xml',
      'docProps/core.xml',
    ]))

    // contentTypes
    addXmlFile('[Content_Types].xml', ContentTypes.stringify(
      Object.values(zip.files)
        .filter(({ dir }) => !dir)
        .map(({ name }) => name),
    ))

    return zip
  }
}
