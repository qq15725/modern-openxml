import type { InnerShadow } from './InnerShadow'
import type { OuterShadow } from './OuterShadow'
import type { PresetShadow } from './PresetShadow'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectlist
 */
@defineElement('a:effectLst')
export class EffectList extends OXML {
  // TODO
  @defineChild('a:blur') declare blur?: OXML
  @defineChild('a:fillOverlay') declare fillOverlay?: OXML
  @defineChild('a:glow') declare glow?: OXML
  @defineChild('a:innerShdw') declare innerShdw?: InnerShadow
  @defineChild('a:outerShdw') declare outerShdw?: OuterShadow
  @defineChild('a:prstShdw') declare prstShdw?: PresetShadow
  @defineChild('a:reflection') declare reflection?: OXML
  @defineChild('a:softEdge') declare softEdge?: OXML
}
