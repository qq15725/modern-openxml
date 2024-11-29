import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

const anchorMap = {
  ctr: 'middle',
  b: 'bottom',
  t: 'top',
}

export type TextAnchoringTypeValues = 'middle' | 'bottom' | 'top'
export type TextWrappingValues = 'none' | 'square'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.bodyproperties
 */
export class BodyProperties extends _Namespace {
  readonly tag = 'bodyPr'

  @defineProperty('anchor', anchorMap) anchor?: TextAnchoringTypeValues
  @defineProperty('anchorCtr', 'boolean') anchorCtr?: boolean
  @defineProperty('spcFirstLastPara', 'boolean') spcFirstLastPara?: boolean
  @defineProperty('lIns', 'emu') lIns?: number
  @defineProperty('tIns', 'emu') tIns?: number
  @defineProperty('rIns', 'emu') rIns?: number
  @defineProperty('bIns', 'emu') bIns?: number
  @defineProperty('rot', 'degree') rot?: number
  @defineProperty('wrap', 'string') wrap?: TextWrappingValues
  @defineProperty('upright', 'boolean') upright?: boolean
}
