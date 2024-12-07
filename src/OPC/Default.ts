import { defineAttribute, defineElement, OXML } from '../core'

@defineElement('Default')
export class Default extends OXML {
  @defineAttribute('ContentType') declare contentType: string
  @defineAttribute('Extension') declare extension: string
}
