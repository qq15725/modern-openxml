import type { FontJSON } from './_Font'
import type { ComplexScriptFont } from './ComplexScriptFont'
import type { EastAsianFont } from './EastAsianFont'
import type { ExtensionList } from './ExtensionList'
import type { Font } from './Font'
import type { LatinFont } from './LatinFont'
import { defineChild, defineProperty, OOXML } from '../../core'

export class _FontStyle extends OOXML {
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:cs') declare cs?: ComplexScriptFont
  @defineChild('a:ea') declare ea?: EastAsianFont
  @defineChild('a:latin') declare latin?: LatinFont

  @defineProperty('cs') declare complexScriptFont?: FontJSON
  @defineProperty('ea') declare eastAsianFont?: FontJSON
  @defineProperty('latin') declare latinFont?: FontJSON
  @defineProperty('_fonts') declare fonts?: FontJSON[]

  get _fonts(): Font[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:extLst':
        case 'a:cs':
        case 'a:ea':
        case 'a:latin':
          return undefined
        case 'a:font':
        default:
          return OOXML.make(element)
      }
    }).filter(Boolean) as any[]
  }
}
