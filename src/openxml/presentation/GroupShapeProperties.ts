import type { OXML } from '../../core'
import type { Transform2D } from '../drawing'
import { defineChild, defineElement } from '../../core'
import { _Properties } from './_Properties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshapeproperties
 */
@defineElement('p:grpSpPr')
export class GroupShapeProperties extends _Properties {
  @defineChild('a:scene3d') scene3d?: OXML
  @defineChild('a:xfrm') xfrm?: Transform2D
}
