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
    const { theme } = ctx
    const { lnRef, fillRef, effectRef, fontRef } = this
    return {
      fill: fillRef ? theme?.fillStyleLst?.children[fillRef.idx] : undefined,
      ln: lnRef ? theme?.lnStyleLst?.children[lnRef.idx] : undefined,
      ...(effectRef ? theme?.effectStyleLst?.children[effectRef.idx] : undefined),
      // TODO
      // font: fontRef ? theme.majorFonts?.children[fontRef.idx] : undefined,
    }
  }
}
