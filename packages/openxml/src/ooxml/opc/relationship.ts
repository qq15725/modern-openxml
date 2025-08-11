import type { OoxmlNode } from '../core'
import { pathJoin, pathToContentType, withIndents } from '../utils'

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
  node: OoxmlNode | undefined,
  relsPath: string,
  contentTypes: { type: string, ext?: string, path?: string }[],
): Relationships {
  if (!node)
    return []
  const getType = (path: string): string | undefined =>
    contentTypes.find(v => v.path && v.path.includes(path))?.type
    ?? contentTypes.find(v => v.ext && path.endsWith(v.ext))?.type

  return node.get('//Relationship').map((v) => {
    const target = v.attr('@Target')!
    let path
    if (target.startsWith('/')) {
      path = target
    }
    else {
      path = pathJoin(relsPath, '..', '..', target)
    }
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
