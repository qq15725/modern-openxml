import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.audio
 */
@defineElement('p:audio')
export class Audio extends OOXML {
  @defineAttribute('isNarration', 'boolean') declare isNarration?: boolean

  @defineChild('p:cMediaNode') declare cMediaNode?: OOXML
}
