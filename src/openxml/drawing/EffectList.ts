import { defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectlist
 */
@defineElement('a:effectLst')
export class EffectList extends OXML {
  // TODO
  @defineChild('blur') blur?: OXML
  @defineChild('fillOverlay') fillOverlay?: OXML
  @defineChild('glow') glow?: OXML
  @defineChild('innerShdw') innerShdw?: OXML
  @defineChild('outerShdw') outerShdw?: OXML
  @defineChild('prstShdw') prstShdw?: OXML
  @defineChild('reflection') reflection?: OXML
  @defineChild('softEdge') softEdge?: OXML
}
