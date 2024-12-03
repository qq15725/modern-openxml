import { defineAttribute, defineElement, OXML } from '../../core'

@defineElement('Override')
export class Override extends OXML {
  @defineAttribute('ContentType') declare contentType: string
  @defineAttribute('PartName') declare partName: string
}
