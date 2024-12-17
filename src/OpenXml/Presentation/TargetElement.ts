import type { ShapeTarget } from './ShapeTarget'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.targetelement
 */
@defineElement('p:tgtEl')
export class TargetElement extends OOXML {
  @defineChild('p:inkTgt') declare inkTgt?: OOXML
  @defineChild('p:sldTgt') declare sldTgt?: OOXML
  @defineChild('p:sndTgt') declare sndTgt?: OOXML
  @defineChild('p:spTgt') declare spTgt?: ShapeTarget
}
