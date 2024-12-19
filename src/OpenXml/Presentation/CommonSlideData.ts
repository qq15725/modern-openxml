import type { Background } from './Background'
import type { ExtensionList } from './ExtensionList'
import type { ShapeTree } from './ShapeTree'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.commonslidedata
 */
@defineElement('p:cSld')
export class CommonSlideData extends OOXML {
  @defineAttribute('name') declare name?: string

  @defineChild('p:bg') declare bg?: Background
  @defineChild('p:controls') declare controls?: OOXML
  @defineChild('p:custDataLst') declare custDataLst?: OOXML
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:spTree', { required: true }) declare spTree: ShapeTree
}
