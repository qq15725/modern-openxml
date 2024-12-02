import { defineChild, defineNode, defineProperty, XmlObject } from '../../core'
import { SolidFill } from './SolidFill'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.run
 */
@defineNode('rPr', 'a')
export class RunProperties extends XmlObject {
  @defineProperty('b', 'boolean') b?: boolean
  @defineProperty('i', 'boolean') i?: boolean
  @defineProperty('u', 'string') u?: string
  @defineProperty('kern', 'emu') kern?: string
  @defineProperty('spc', 'fontsize') spc?: number
  @defineProperty('sz', 'fontsize') sz?: number

  @defineChild('a:cs', XmlObject) cs?: XmlObject
  @defineChild('a:ea', XmlObject) ea?: XmlObject
  @defineChild('a:latin', XmlObject) latin?: XmlObject
  @defineChild('a:sym', XmlObject) sym?: XmlObject
  @defineChild('a:solidFill', SolidFill) solidFill?: SolidFill
}
