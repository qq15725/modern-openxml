import type { Fill } from './_FillList'
import type { EffectList } from './EffectList'
import type { EffectReference } from './EffectReference'
import type { FillReference } from './FillReference'
import type { Font } from './Font'
import type { FontReference } from './FontReference'
import type { LineReference } from './LineReference'
import type { Outline } from './Outline'
import type { Theme } from './Theme'
import { defineChild, OOXML } from '../../core'

export interface ParsedShapeStyle {
  fill?: Fill
  ln?: Outline
  effectLst?: EffectList
  font?: Font
}

export abstract class _ShapeStyle extends OOXML {
  @defineChild('a:lnRef') declare lnRef?: LineReference
  @defineChild('a:fillRef') declare fillRef?: FillReference
  @defineChild('a:effectRef') declare effectRef?: EffectReference
  @defineChild('a:fontRef') declare fontRef?: FontReference

  parse(ctx: { theme?: Theme }): ParsedShapeStyle {
    const { lnRef, fillRef, effectRef, fontRef } = this
    const { theme } = ctx
    const effect = effectRef
      ? theme?.themeElements?.fmtScheme?.effectStyleLst?.children[effectRef.idx]
      : undefined
    return {
      ln: lnRef
        ? theme?.themeElements?.fmtScheme?.lnStyleLst?.children[lnRef.idx]
        : undefined,
      fill: fillRef
        ? theme?.themeElements?.fmtScheme?.fillStyleLst?.children[fillRef.idx]
        : undefined,
      effectLst: effect?.effectLst,
      // TODO
      // font: fontRef ? theme.majorFonts?.children[fontRef.idx] : undefined,
    }
  }
}
