import type {
  _Fill,
  EffectReference,
  EffectStyle,
  FillReference,
  Font,
  FontReference,
  LineReference,
  Outline,
  Theme,
} from '../Drawing'
import { defineChild, defineElement, OOXML } from '../../core'

export interface ParsedShapeStyle {
  fill?: _Fill
  ln?: Outline
  effect?: EffectStyle
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

  parse(theme: Theme): ParsedShapeStyle {
    const { lnRef, fillRef, effectRef, fontRef } = this
    return {
      fill: fillRef ? theme.fillStyleLst?.children[fillRef.idx] : undefined,
      ln: lnRef ? theme.lnStyleLst?.children[lnRef.idx] : undefined,
      effect: effectRef ? theme.effectStyleLst?.children[effectRef.idx] : undefined,
      font: fontRef ? theme.majorFonts?.children[fontRef.idx] : undefined,
    }
  }
}
