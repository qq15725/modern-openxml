import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.formatscheme
 */
@defineElement('a:fmtScheme')
export class FormatScheme extends OXML {
  @defineAttribute('name') declare name?: string

  @defineChild('a:bgFillStyleLst') declare bgFillStyleLst?: OXML
  @defineChild('a:effectStyleLst') declare effectStyleLst?: OXML
  @defineChild('a:fillStyleLst') declare fillStyleLst?: OXML
  @defineChild('a:lnStyleLst') declare lnStyleLst?: OXML
}
