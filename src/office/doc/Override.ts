import { defineNode, defineProperty, XmlObject } from '../../core'

@defineNode('Override')
export class Override extends XmlObject {
  @defineProperty('ContentType', 'string') declare contentType: string
  @defineProperty('PartName', 'string') declare partName: string
}
