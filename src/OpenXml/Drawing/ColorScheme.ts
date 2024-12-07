import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.colorscheme
 */
@defineElement('a:clrScheme')
export class ColorScheme extends OXML {
  @defineAttribute('name') declare name?: string

  @defineChild('a:dk1') declare dk1?: OXML
  @defineChild('a:lt1') declare lt1?: OXML
  @defineChild('a:dk2') declare dk2?: OXML
  @defineChild('a:lt2') declare lt2?: OXML
  @defineChild('a:accent1') declare accent1?: OXML
  @defineChild('a:accent2') declare accent2?: OXML
  @defineChild('a:accent3') declare accent3?: OXML
  @defineChild('a:accent4') declare accent4?: OXML
  @defineChild('a:accent5') declare accent5?: OXML
  @defineChild('a:accent6') declare accent6?: OXML
  @defineChild('a:hlink') declare hlink?: OXML
  @defineChild('a:folHlink') declare folHlink?: OXML
}
