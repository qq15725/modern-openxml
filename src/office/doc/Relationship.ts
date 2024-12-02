import { defineNode, defineProperty, XmlObject } from '../../core'

@defineNode('Relationship')
export class Relationship extends XmlObject {
  @defineProperty('Id', 'string') declare id: string
  @defineProperty('Type', 'string') declare type: string
  @defineProperty('Target', 'string') declare target: string
}
