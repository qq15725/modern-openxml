import type { InnerShadow } from './InnerShadow'
import type { OuterShadow } from './OuterShadow'
import type { PresetShadow } from './PresetShadow'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectlist
 */
@defineElement('a:effectLst')
export class EffectList extends OOXML {
  // TODO
  @defineChild('a:blur') declare blur?: OOXML
  @defineChild('a:fillOverlay') declare fillOverlay?: OOXML
  @defineChild('a:glow') declare glow?: OOXML
  @defineChild('a:innerShdw') declare innerShdw?: InnerShadow
  @defineChild('a:outerShdw') declare outerShdw?: OuterShadow
  @defineChild('a:prstShdw') declare prstShdw?: PresetShadow
  @defineChild('a:reflection') declare reflection?: OOXML
  @defineChild('a:softEdge') declare softEdge?: OOXML
}
