import { defineAttribute, defineElement, OOXML } from '../core'

@defineElement('Relationship')
export class Relationship extends OOXML {
  @defineAttribute('Id') declare id: string
  @defineAttribute('Type') declare type: string
  @defineAttribute('Target') declare target: string
}
