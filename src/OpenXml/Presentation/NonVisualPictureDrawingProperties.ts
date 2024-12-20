import type { ExtensionList, PictureLocks } from '../Drawing'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualpicturedrawingproperties
 */
@defineElement('p:cNvPicPr')
export class NonVisualPictureDrawingProperties extends OOXML {
  @defineAttribute('preferRelativeResize', 'boolean') declare preferRelativeResize?: boolean

  @defineChild('a:picLocks') declare picLocks?: PictureLocks
  @defineChild('a:extLst') declare extLst?: ExtensionList
}
