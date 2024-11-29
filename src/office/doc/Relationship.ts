import { defineProperty, XmlObject } from '../../core'

const RELATIONSHIP = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

export interface RelationshipProperties {
  id: string
  type: string
  target: string
}

export class Relationship extends XmlObject {
  readonly tag = 'Relationship'

  @defineProperty('Id', 'string') declare id: string
  @defineProperty('Type', 'string') declare type: string
  @defineProperty('Target', 'string') declare target: string

  constructor(properties: Partial<RelationshipProperties> = {}) {
    super()
    this.setProperties(properties)
  }
}
