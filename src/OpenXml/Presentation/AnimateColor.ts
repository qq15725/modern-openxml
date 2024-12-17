import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.animatecolor
 */
@defineElement('p:animClr')
export class AnimateColor extends OOXML {
  @defineChild('p:by') declare by?: OOXML
  @defineChild('p:cBhvr') declare cBhvr?: OOXML
  @defineChild('p:from') declare from?: OOXML
  @defineChild('p:to') declare to?: OOXML
}
