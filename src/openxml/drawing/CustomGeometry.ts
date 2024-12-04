import type { Rectangle } from './Rectangle'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.customgeometry
 */
@defineElement('a:custGeom')
export class CustomGeometry extends OXML {
  @defineChild('a:ahLst') declare ahLst: OXML
  @defineChild('a:avLst') declare avLst: OXML
  @defineChild('a:cxnLst') declare cxnLst: OXML
  @defineChild('a:gdLst') declare gdLst: OXML
  @defineChild('a:pathLst') declare pathLst: OXML
  @defineChild('a:rect') declare rect: Rectangle
}
