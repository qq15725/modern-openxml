// a:theme
import type { OoxmlNode } from '../core'

export interface CoreProperties {
  title?: string
  subject?: string
  creator?: string
  lastModifiedBy?: string
  revision?: string
  modified?: string
}

export function parseCoreProperties(node: OoxmlNode): CoreProperties {
  return {
    title: node.attr('dc:title/text()', 'string'),
    subject: node.attr('dc:subject/text()', 'string'),
    creator: node.attr('dc:creator/text()', 'string'),
    lastModifiedBy: node.attr('dc:lastModifiedBy/text()', 'string'),
    revision: node.attr('dc:revision/text()', 'string'),
    modified: node.attr('dcterms:modified/text()', 'string'),
  }
}

export function stringifyCoreProperties(props: CoreProperties): string {
  const d = new Date()
  const str = `${d.getFullYear()}-${
    d.getMonth() + 1
  }-${d.getDate()}T${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}Z`
  return `<cp:coreProperties
  xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dcterms="http://purl.org/dc/terms/"
  xmlns:dcmitype="http://purl.org/dc/dcmitype/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
>
  <dc:title>${props.title ?? 'modern-openxml'}</dc:title>
  <dc:subject>${props.subject ?? 'modern-openxml'}</dc:subject>
  <dc:creator>${props.creator ?? 'modern-openxml'}</dc:creator>
  <cp:lastModifiedBy>${props.lastModifiedBy ?? 'modern-openxml'}</cp:lastModifiedBy>
  <cp:revision>${props.revision ?? 1}</cp:revision>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${str}</dcterms:modified>
</cp:coreProperties>`
}
