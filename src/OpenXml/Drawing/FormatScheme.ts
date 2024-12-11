import type { BackgroundFillStyleList } from './BackgroundFillStyleList'
import type { EffectStyleList } from './EffectStyleList'
import type { FillStyleList } from './FillStyleList'
import type { LineStyleList } from './LineStyleList'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.formatscheme
 */
@defineElement('a:fmtScheme')
export class FormatScheme extends OOXML {
  @defineAttribute('name') declare name?: string

  @defineChild('a:bgFillStyleLst') declare bgFillStyleLst?: BackgroundFillStyleList
  @defineChild('a:effectStyleLst') declare effectStyleLst?: EffectStyleList
  @defineChild('a:fillStyleLst') declare fillStyleLst?: FillStyleList
  @defineChild('a:lnStyleLst') declare lnStyleLst?: LineStyleList
}
