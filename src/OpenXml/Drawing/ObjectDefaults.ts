import type { ExtensionList } from './ExtensionList'
import type { LineDefault } from './LineDefault'
import type { ShapeDefault } from './ShapeDefault'
import type { TextDefault } from './TextDefault'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.objectdefaults
 */
@defineElement('a:objectDefaults')
export class ObjectDefaults extends OOXML {
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:lnDef') declare lnDef?: LineDefault
  @defineChild('a:spDef') declare spDef?: ShapeDefault
  @defineChild('a:txDef') declare txDef?: TextDefault
}
