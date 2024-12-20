import type { ExtensionList } from './ExtensionList'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.picturelocks
 */
@defineElement('a:picLocks')
export class PictureLocks extends OOXML {
  @defineAttribute('noAdjustHandles', 'boolean') declare noAdjustHandles?: boolean
  @defineAttribute('noChangeArrowheads', 'boolean') declare noChangeArrowheads?: boolean
  @defineAttribute('noChangeAspect', 'boolean') declare noChangeAspect?: boolean
  @defineAttribute('noChangeShapeType', 'boolean') declare noChangeShapeType?: boolean
  @defineAttribute('noCrop', 'boolean') declare noCrop?: boolean
  @defineAttribute('noEditPoints', 'boolean') declare noEditPoints?: boolean
  @defineAttribute('noGrp', 'boolean') declare noGrp?: boolean
  @defineAttribute('noMove', 'boolean') declare noMove?: boolean
  @defineAttribute('noResize', 'boolean') declare noResize?: boolean
  @defineAttribute('noRot', 'boolean') declare noRot?: boolean
  @defineAttribute('noSelect', 'boolean') declare noSelect?: boolean

  @defineChild('a:extLst') declare extLst?: ExtensionList
}
