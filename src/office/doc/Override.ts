import { defineElement, defineProperty, OXML } from '../../core'

@defineElement('Override')
export class Override extends OXML {
  @defineProperty('ContentType', 'string') declare contentType: string
  @defineProperty('PartName', 'string') declare partName: string
}
