import { defineElement, defineProperty, OXML } from '../../core'

@defineElement('Relationship')
export class Relationship extends OXML {
  @defineProperty('Id', 'string') declare id: string
  @defineProperty('Type', 'string') declare type: string
  @defineProperty('Target', 'string') declare target: string
}
