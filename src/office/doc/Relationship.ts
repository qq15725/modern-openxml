import { defineProperty, XmlObject } from '../../core'

export class Relationship extends XmlObject {
  readonly tag = 'Relationship'

  @defineProperty('Id', 'string') declare id: string
  @defineProperty('Type', 'string') declare type: string
  @defineProperty('Target', 'string') declare target: string
}
