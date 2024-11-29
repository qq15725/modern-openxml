import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

const alignmentMap = {
  ctr: 'center',
  dist: 'distributed',
  just: 'justified',
  justLow: 'justified-low',
  l: 'left',
  r: 'right',
  thaiDist: 'thai-distributed',
}

export type Alignment = 'center' | 'distributed' | 'justified' | 'justified-low' | 'left' | 'right' | 'thai-distributed'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.paragraphproperties
 */
export class ParagraphProperties extends _Namespace {
  readonly tag = 'pPr'

  @defineProperty('lvl', 'number') lvl?: number
  @defineProperty('marL', 'emu') marL?: number
  @defineProperty('marR', 'emu') marR?: number
  @defineProperty('indent', 'emu') indent?: number
  @defineProperty('algn', alignmentMap) algn?: Alignment
  @defineProperty('fontAlgn', 'string') fontAlgn?: string
  @defineProperty('rtl', 'string') rtl?: string
}
