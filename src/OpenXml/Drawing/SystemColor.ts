import type { RGB } from './_Color'
import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

interface SysColors {
  [key: string]: string
}

const sysColors: SysColors = {
  windowText: '#000000',
  window: '#FFFFFF',
  menu: '#F0F0F0',
  buttonFace: '#F0F0F0',
  buttonText: '#000000',
  highlight: '#3399FF',
  highlightText: '#FFFFFF',
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.systemcolor
 */
@defineElement('a:sysClr')
export class SystemColor extends _Color {
  @defineAttribute('val') declare val: string

  override toRGB(): RGB {
    return this.hexToRgb(sysColors[this.val] ?? '#000000')
  }
}
