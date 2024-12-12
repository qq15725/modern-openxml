import type { PresetLineDashVal } from './_types'
import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.presetdash
 */
@defineElement('a:prstDash')
export class PresetDash extends OOXML {
  @defineAttribute('val') declare val: PresetLineDashVal
}
