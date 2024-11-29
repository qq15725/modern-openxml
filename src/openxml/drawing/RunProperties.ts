import { defineChild, defineProperty } from '../../core'
import { _Namespace } from './_Namespace'
import { SolidFill } from './SolidFill'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.run
 */
export class RunProperties extends _Namespace {
  readonly tag = 'rPr'

  @defineProperty('b', 'boolean') b?: boolean
  @defineProperty('i', 'boolean') i?: boolean
  @defineProperty('u', 'string') u?: string
  @defineProperty('kern', 'emu') kern?: string
  @defineProperty('spc', 'fontsize') spc?: number
  @defineProperty('sz', 'fontsize') sz?: number

  @defineChild('a:cs', _Namespace) cs?: _Namespace
  @defineChild('a:ea', _Namespace) ea?: _Namespace
  @defineChild('a:latin', _Namespace) latin?: _Namespace
  @defineChild('a:sym', _Namespace) sym?: _Namespace
  @defineChild('a:solidFill', SolidFill) solidFill?: SolidFill
}
