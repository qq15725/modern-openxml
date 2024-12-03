import { defineElement, defineProperty, OXML } from '../../core'

@defineElement('Default')
export class Default extends OXML {
  @defineProperty('ContentType', 'string') declare contentType: string
  @defineProperty('Extension', 'string') declare extension: string
}
