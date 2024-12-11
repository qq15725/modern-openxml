import type { ExtensionList } from './ExtensionList'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.printingproperties
 */
@defineElement('p:prnPr')
export class PrintingProperties extends OOXML {
  @defineAttribute('clrMode', 'ST_PrintColorMode') declare clrMode?: string
  @defineAttribute('frameSlides', 'boolean') declare frameSlides?: boolean
  @defineAttribute('hiddenSlides', 'boolean') declare hiddenSlides?: boolean
  @defineAttribute('prnWhat', 'ST_PrintWhat') declare prnWhat?: string
  @defineAttribute('scaleToFitPaper', 'boolean') declare scaleToFitPaper?: boolean

  @defineChild('p:extLst') declare extLst?: ExtensionList
}
