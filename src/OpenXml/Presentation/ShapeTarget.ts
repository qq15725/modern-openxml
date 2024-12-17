import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapetarget
 */
@defineElement('p:spTgt')
export class ShapeTarget extends OOXML {
  @defineAttribute('spid', 'ST_ShapeID') declare spid?: number

  @defineChild('p:bg') declare bg?: OOXML
  @defineChild('p:graphicEl') declare graphicEl?: OOXML
  @defineChild('p:oleChartEl') declare oleChartEl?: OOXML
  @defineChild('p:subSp') declare subSp?: OOXML
  @defineChild('p:txEl') declare txEl?: OOXML
}
