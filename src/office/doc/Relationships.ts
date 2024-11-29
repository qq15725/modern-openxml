import type { RelationshipProperties } from './Relationship'
import { XmlObject } from '../../core'
import { Relationship } from './Relationship'

export class Relationships extends XmlObject {
  readonly tag = 'Relationships'

  attrs = {
    xmlns: 'http://schemas.openxmlformats.org/package/2006/relationships',
  }

  relationships: Relationship[]

  constructor(relationships: Partial<RelationshipProperties>[] = []) {
    super()
    this.relationships = relationships.map((v, index) => {
      return new Relationship({ id: `rId${index + 1}`, ...v })
    })
  }
}
