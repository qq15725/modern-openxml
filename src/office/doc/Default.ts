import { defineProperty, XmlObject } from '../../core'

export class Default extends XmlObject {
  readonly tag = 'Default'

  @defineProperty('ContentType', 'string') declare contentType: string
  @defineProperty('Extension', 'string') declare extension: string
}
