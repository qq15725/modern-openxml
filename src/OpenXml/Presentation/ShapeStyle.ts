import type {
  BlipFill,
  EffectReference,
  FillReference,
  FontReference,
  LineReference,
  Theme,
} from '../Drawing'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapestyle
 */
@defineElement('p:style')
export class ShapeStyle extends OOXML {
  @defineChild('a:lnRef') declare lnRef?: LineReference
  @defineChild('a:fillRef') declare fillRef?: FillReference
  @defineChild('a:effectRef') declare effectRef?: EffectReference
  @defineChild('a:fontRef') declare fontRef?: FontReference

  getFill(theme: Theme) {
    const { fillRef } = this

    const res = {}
    if (fillRef) {
      const fill = theme.fillStyleLst.children[fillRef.idx]
      if (fill instanceof BlipFill) {
        //
      }
    }

    return {
      color: '',
    }
  }
}
