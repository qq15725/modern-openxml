import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.colormap
 */
@defineElement('a:clrMap')
export class ColorMap extends OOXML {
  @defineAttribute('accent1', { isProperty: true }) declare accent1?: string
  @defineAttribute('accent2', { isProperty: true }) declare accent2?: string
  @defineAttribute('accent3', { isProperty: true }) declare accent3?: string
  @defineAttribute('accent4', { isProperty: true }) declare accent4?: string
  @defineAttribute('accent5', { isProperty: true }) declare accent5?: string
  @defineAttribute('accent6', { isProperty: true }) declare accent6?: string
  @defineAttribute('bg1', { isProperty: true }) declare bg1?: string
  @defineAttribute('bg2', { isProperty: true }) declare bg2?: string
  @defineAttribute('folHlink', { isProperty: true }) declare folHlink?: string
  @defineAttribute('hlink', { isProperty: true }) declare hlink?: string
  @defineAttribute('tx1', { isProperty: true }) declare tx1?: string
  @defineAttribute('tx2', { isProperty: true }) declare tx2?: string
}
