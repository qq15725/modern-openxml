import type {
  EffectList,
  EffectReference,
  Fill,
  FillReference,
  Font,
  FontReference,
  LineReference,
  Outline,
  Theme,
} from '../Drawing'
import { defineChild, defineElement, OOXML } from '../../core'

export interface ParsedShapeStyle {
  fill?: Fill
  ln?: Outline
  effectLst?: EffectList
  font?: Font
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapestyle
 */
@defineElement('p:style')
export class ShapeStyle extends OOXML {
  @defineChild('a:lnRef') declare lnRef?: LineReference
  @defineChild('a:fillRef') declare fillRef?: FillReference
  @defineChild('a:effectRef') declare effectRef?: EffectReference
  @defineChild('a:fontRef') declare fontRef?: FontReference

  parse(ctx: { theme?: Theme }): ParsedShapeStyle {
    const { lnRef, fillRef, effectRef, fontRef } = this
    const { theme } = ctx
    return {
      ln: lnRef
        ? theme?.themeElements?.fmtScheme?.lnStyleLst?.children[lnRef.idx]
        : undefined,
      fill: fillRef
        ? theme?.themeElements?.fmtScheme?.fillStyleLst?.children[fillRef.idx]
        : undefined,
      ...(
        effectRef
          ? theme?.themeElements?.fmtScheme?.effectStyleLst?.children[effectRef.idx]
          : undefined
      ),
      // TODO
      // font: fontRef ? theme.majorFonts?.children[fontRef.idx] : undefined,
    }
  }
}
