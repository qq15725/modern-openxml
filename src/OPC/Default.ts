import { defineAttribute, defineElement, OOXML } from '../core'

@defineElement('Default')
export class Default extends OOXML {
  @defineAttribute('ContentType') declare contentType: string
  @defineAttribute('Extension') declare extension: string
}
