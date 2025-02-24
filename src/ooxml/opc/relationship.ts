import type { OOXMLNode } from '../core'
import { pathToContentType, withIndents } from '../utils'

const RELATIONSHIP = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
const RELATIONSHIP2007 = 'http://schemas.microsoft.com/office/2007/relationships'

const RELATIONSHIP_TYPES = {
  presentation: 'officeDocument',
  app: 'extended-properties',
  core: 'metadata/core-properties',
}

export type Relationships = ({
  id: string | undefined
  type: string | undefined
  path: string
})[]

export function parseRelationships(
  node: OOXMLNode | undefined,
  relsPath: string,
  contentTypes: { type: string, ext?: string, path?: string }[],
): Relationships {
  if (!node)
    return []
  const getType = (path: string): string | undefined =>
    contentTypes.find(v => v.path && v.path.includes(path))?.type
    ?? contentTypes.find(v => v.ext && path.endsWith(v.ext))?.type

  let rels = relsPath.split('/')
  rels = rels.length >= 3 ? rels.slice(0, rels.length - 2) : []

  return node.get('//Relationship').map((v) => {
    let path = v.attr('@Target')!
    const paths = path.split('/')
    path
            = rels.length > 0
        ? [
            ...rels.slice(0, rels.length - paths.filter(v => v === '..').length),
            ...paths.filter(v => v !== '..'),
          ].join('/')
        : path
    return {
      id: v.attr('@Id'),
      type: getType(path),
      path,
    }
  })
}

export function stringifyRelationships(targets: string[] = []): string {
  const relationships: string[] = []
  let id = 0
  targets.forEach((target) => {
    const contentType_ = pathToContentType(target)?.[0]
    if (!contentType_)
      return
    let contentType = RELATIONSHIP_TYPES[contentType_ as keyof typeof RELATIONSHIP_TYPES] ?? contentType_
    if (['audio', 'video'].some(item => contentType.startsWith(item))) {
      contentType = contentType.split('/')[0]
      relationships.push(`<Relationship Id="rId${++id}" Type="${RELATIONSHIP2007}/media" Target="${target}" />`)
    }
    if (contentType.startsWith('image')) {
      contentType = 'image'
    }
    if (contentType.startsWith('video')) {
      contentType = 'video'
    }
    relationships.push(`<Relationship Id="rId${++id}" Type="${RELATIONSHIP}/${contentType}" Target="${target}" />`)
  })

  return `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${withIndents(relationships)}
</Relationships>`
}
