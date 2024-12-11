import type { OOXML } from '../../core'
import type { Transform2D } from '../Drawing'
import { defineChild, defineElement } from '../../core'
import { _Properties } from './_Properties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshapeproperties
 */
@defineElement('p:grpSpPr')
export class GroupShapeProperties extends _Properties {
  @defineChild('a:scene3d') declare scene3d?: OOXML
  @defineChild('a:xfrm') declare xfrm: Transform2D
}
