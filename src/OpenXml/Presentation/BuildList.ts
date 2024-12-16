import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.buildlist
 */
@defineElement('p:bldLst')
export class BuildList extends OOXML {
  @defineChild('p:bldDgm') declare bldDgm?: OOXML
  @defineChild('p:bldGraphic') declare bldGraphic?: OOXML
  @defineChild('p:bldOleChart') declare bldOleChart?: OOXML
  @defineChild('p:bldP') declare bldP?: OOXML
}
