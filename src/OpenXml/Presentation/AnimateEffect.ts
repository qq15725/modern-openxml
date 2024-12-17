import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.animateeffect
 */
@defineElement('p:animEffect')
export class AnimateEffect extends OOXML {
  @defineChild('p:cBhvr') declare cBhvr?: OOXML
  @defineChild('p:progress') declare progress?: OOXML
}
