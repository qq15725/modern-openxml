import type { ExtensionList } from './ExtensionList'
import type { MajorFont } from './MajorFont'
import type { MinorFont } from './MinorFont'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fontscheme
 */
@defineElement('a:fontScheme')
export class FontScheme extends OOXML {
  @defineAttribute('name') declare name?: string

  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:majorFont') declare majorFont?: MajorFont
  @defineChild('a:minorFont') declare minorFont?: MinorFont
}
