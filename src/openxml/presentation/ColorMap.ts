import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormap
 */
@defineElement('p:clrMap')
export class ColorMap extends OXML {
  @defineAttribute('accent1') accent1?: string
  @defineAttribute('accent2') accent2?: string
  @defineAttribute('accent3') accent3?: string
  @defineAttribute('accent4') accent4?: string
  @defineAttribute('accent5') accent5?: string
  @defineAttribute('accent6') accent6?: string
  @defineAttribute('bg1') bg1?: string
  @defineAttribute('bg2') bg2?: string
  @defineAttribute('folHlink') folHlink?: string
  @defineAttribute('hlink') hlink?: string
  @defineAttribute('tx1') tx1?: string
  @defineAttribute('tx2') tx2?: string
}
