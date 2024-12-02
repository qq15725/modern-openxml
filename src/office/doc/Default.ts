import { defineNode, defineProperty, XmlObject } from '../../core'

@defineNode('Default')
export class Default extends XmlObject {
  @defineProperty('ContentType', 'string') declare contentType: string
  @defineProperty('Extension', 'string') declare extension: string
}
