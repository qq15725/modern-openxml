import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormap
 */
@defineElement('p:clrMap')
export class ColorMap extends OXML {
  @defineAttribute('accent1') declare accent1?: string
  @defineAttribute('accent2') declare accent2?: string
  @defineAttribute('accent3') declare accent3?: string
  @defineAttribute('accent4') declare accent4?: string
  @defineAttribute('accent5') declare accent5?: string
  @defineAttribute('accent6') declare accent6?: string
  @defineAttribute('bg1') declare bg1?: string
  @defineAttribute('bg2') declare bg2?: string
  @defineAttribute('folHlink') declare folHlink?: string
  @defineAttribute('hlink') declare hlink?: string
  @defineAttribute('tx1') declare tx1?: string
  @defineAttribute('tx2') declare tx2?: string
}