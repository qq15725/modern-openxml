import { defineAttribute, defineElement, OOXML } from '../core'

@defineElement('Override')
export class Override extends OOXML {
  @defineAttribute('ContentType') declare contentType: string
  @defineAttribute('PartName') declare partName: string
}
