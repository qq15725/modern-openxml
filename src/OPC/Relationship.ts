import { defineAttribute, defineElement, OXML } from '../core'

@defineElement('Relationship')
export class Relationship extends OXML {
  @defineAttribute('Id') declare id: string
  @defineAttribute('Type') declare type: string
  @defineAttribute('Target') declare target: string
}
