import { defineAttribute, OOXML } from '../../core'

export interface IDOCColorMap {
  accent1?: string
  accent2?: string
  accent3?: string
  accent4?: string
  accent5?: string
  accent6?: string
  bg1?: string
  bg2?: string
  folHlink?: string
  hlink?: string
  tx1?: string
  tx2?: string
}

const options = {
  isProperty: true,
}

export abstract class _ColorMap extends OOXML {
  @defineAttribute('accent1', options) declare accent1?: string
  @defineAttribute('accent2', options) declare accent2?: string
  @defineAttribute('accent3', options) declare accent3?: string
  @defineAttribute('accent4', options) declare accent4?: string
  @defineAttribute('accent5', options) declare accent5?: string
  @defineAttribute('accent6', options) declare accent6?: string
  @defineAttribute('bg1', options) declare bg1?: string
  @defineAttribute('bg2', options) declare bg2?: string
  @defineAttribute('folHlink', options) declare folHlink?: string
  @defineAttribute('hlink', options) declare hlink?: string
  @defineAttribute('tx1', options) declare tx1?: string
  @defineAttribute('tx2', options) declare tx2?: string

  override toIDOC(): IDOCColorMap {
    return super.toIDOC()
  }
}
