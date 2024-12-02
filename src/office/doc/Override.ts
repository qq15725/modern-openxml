import { defineProperty, XmlObject } from '../../core'

export class Override extends XmlObject {
  readonly tag = 'Override'

  @defineProperty('ContentType', 'string') declare contentType: string
  @defineProperty('PartName', 'string') declare partName: string
}
