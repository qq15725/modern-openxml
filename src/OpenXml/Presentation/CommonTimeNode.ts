import type { ChildTimeNodeList } from './ChildTimeNodeList'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.commontimenode
 */
@defineElement('p:cTn')
export class CommonTimeNode extends OOXML {
  @defineAttribute('accel') declare accel?: any
  @defineAttribute('afterEffect') declare afterEffect?: any
  @defineAttribute('autoRev') declare autoRev?: any
  @defineAttribute('bldLvl') declare bldLvl?: any
  @defineAttribute('decel') declare decel?: any
  @defineAttribute('display') declare display?: any
  @defineAttribute('dur') declare dur?: any
  @defineAttribute('evtFilter') declare evtFilter?: any
  @defineAttribute('fill') declare fill?: any
  @defineAttribute('grpId') declare grpId?: any
  @defineAttribute('id') declare id?: any
  @defineAttribute('masterRel') declare masterRel?: any
  @defineAttribute('nodePh') declare nodePh?: any
  @defineAttribute('nodeType') declare nodeType?: string
  @defineAttribute('presetClass') declare presetClass?: any
  @defineAttribute('presetID') declare presetID?: any
  @defineAttribute('presetSubtype') declare presetSubtype?: any
  @defineAttribute('repeatCount') declare repeatCount?: any
  @defineAttribute('repeatDur') declare repeatDur?: any
  @defineAttribute('restart') declare restart?: any
  @defineAttribute('spd') declare spd?: any
  @defineAttribute('syncBehavior') declare syncBehavior?: any
  @defineAttribute('tmFilter') declare tmFilter?: any

  @defineChild('p:childTnLst') declare childTnLst?: ChildTimeNodeList
  @defineChild('p:endCondLst') declare endCondLst?: OOXML
  @defineChild('p:endSync') declare endSync?: OOXML
  @defineChild('p:iterate') declare iterate?: OOXML
  @defineChild('p:stCondLst') declare stCondLst?: OOXML
  @defineChild('p:subTnLst') declare subTnLst?: OOXML
}
