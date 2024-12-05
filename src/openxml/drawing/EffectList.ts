import { defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectlist
 */
@defineElement('a:effectLst')
export class EffectList extends OXML {
  // TODO
  @defineChild('blur') declare blur?: OXML
  @defineChild('fillOverlay') declare fillOverlay?: OXML
  @defineChild('glow') declare glow?: OXML
  @defineChild('innerShdw') declare innerShdw?: OXML
  @defineChild('outerShdw') declare outerShdw?: OXML
  @defineChild('prstShdw') declare prstShdw?: OXML
  @defineChild('reflection') declare reflection?: OXML
  @defineChild('softEdge') declare softEdge?: OXML
}
