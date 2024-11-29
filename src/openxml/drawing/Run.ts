import { defineChild } from '../../core'
import {
  Bool,
  clearUndefProp,
  FontSize,
  Pixel,
} from '../utils'
import { _Namespace } from './_Namespace'
import { RunProperties } from './RunProperties'
import { Text } from './Text'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.run
 */
export class Run extends _Namespace {
  readonly tag = 'r'

  @defineChild('rPr', RunProperties) declare rPr: RunProperties
  @defineChild('t', Text) declare t: Text

  get color(): string | undefined { return this.rPr.solidFill?.srgbClr.val }
  get bold(): boolean | undefined { return this.rPr.b }
  get italic(): boolean | undefined { return this.rPr.i }
  get underline(): string | undefined { return this.rPr.u }
  get textIndent(): string | undefined { return this.rPr.kern }
  get letterSpacing(): number | undefined { return this.rPr.spc }
  get fontSize(): number | undefined { return this.rPr.sz }
  get fontComplexScript(): string | undefined { return this.rPr.cs?.typeface }
  get fontEastasian(): string | undefined { return this.rPr.ea?.typeface }
  get fontLatin(): string | undefined { return this.rPr.latin?.typeface }
  get fontSymbol(): string | undefined { return this.rPr.sym?.typeface }
  override get textContent(): string { return this.t.textContent }

  parse(node: VNode, context?: any) {
    let color: string | undefined
    let alpha: string | undefined
    const schemeColor = node.attr('a:rPr/a:solidFill/a:schemeClr/@val')
    if (schemeColor) {
      if (context?.layout?.colorMap && schemeColor in context?.layout?.colorMap) {
        color = context?.layout?.colorMap[schemeColor]
      }
      else if (context?.master?.colorMap && schemeColor in context?.master?.colorMap) {
        color = context?.master?.colorMap[schemeColor]
      }
      if (color && context?.theme?.colorScheme && color in context?.theme?.colorScheme) {
        color = context?.theme?.colorScheme[color!]
      }
    }
    else {
      color = node.attr('a:rPr/a:solidFill/a:srgbClr/@val')
      alpha = node.attr('a:rPr/a:solidFill/a:srgbClr/a:alpha/@val')
    }

    return clearUndefProp({
      bold: Bool.decode(node.attr('a:rPr/@b')),
      italic: Bool.decode(node.attr('a:rPr/@i')),
      underline: node.attr('a:rPr/@u'),
      textIndent: Pixel.decode(node.attr('a:rPr/@kern')),
      letterSpacing: FontSize.decode(node.attr('a:rPr/@spc')),
      fontSize: FontSize.decode(node.attr('a:rPr/@sz')),
      fontComplexScript: node.attr('a:rPr/a:cs/@typeface'),
      fontEastasian: node.attr('a:rPr/a:ea/@typeface'),
      fontLatin: node.attr('a:rPr/a:latin/@typeface'),
      fontSymbol: node.attr('a:rPr/a:sym/@typeface'),
      color,
      alpha,
      text: node.find('a:t')?.getEl().textContent,
    })
  }
}
