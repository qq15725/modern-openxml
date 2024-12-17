import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.animate
 */
@defineElement('p:anim')
export class Animate extends OOXML {
  @defineAttribute('by') declare by?: string
  @defineAttribute('calcmode', 'ST_TLAnimateBehaviorCalcMode') declare calcmode?: string
  @defineAttribute('from') declare from?: string
  @defineAttribute('to') declare to?: string
  @defineAttribute('valueType', 'ST_TLAnimateBehaviorValueType') declare valueType?: string

  @defineChild('p:cBhvr') declare cBhvr?: OOXML
  @defineChild('p:tavLst') declare tavLst?: OOXML
}
