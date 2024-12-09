import type { ExtensionList } from './ExtensionList'
import type { MajorFont } from './MajorFont'
import type { MinorFont } from './MinorFont'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fontscheme
 */
@defineElement('a:fontScheme')
export class FontScheme extends OXML {
  @defineAttribute('name') declare name?: string

  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:majorFont') declare majorFont?: MajorFont
  @defineChild('a:minorFont') declare minorFont?: MinorFont
}
