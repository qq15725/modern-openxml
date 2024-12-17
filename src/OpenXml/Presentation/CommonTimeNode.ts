import type { ChildTimeNodeList } from './ChildTimeNodeList'
import type { StartConditionList } from './StartConditionList'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.commontimenode
 */
@defineElement('p:cTn')
export class CommonTimeNode extends OOXML {
  @defineAttribute('accel', 'ST_PositiveFixedPercentage') declare accel?: number
  @defineAttribute('afterEffect', 'boolean') declare afterEffect?: boolean
  @defineAttribute('autoRev', 'boolean') declare autoRev?: boolean
  @defineAttribute('bldLvl', 'int') declare bldLvl?: number
  @defineAttribute('decel', 'ST_PositiveFixedPercentage') declare decel?: number
  @defineAttribute('display', 'boolean') declare display?: boolean
  // 'indefinite' | 'prev' | 0 | number
  @defineAttribute('dur', 'ST_TLTime') declare dur?: string
  @defineAttribute('evtFilter') declare evtFilter?: string
  @defineAttribute('fill', 'ST_TLTimeNodeFillType') declare fill?: 'none' | 'freeze' | 'hold' | 'transition'
  @defineAttribute('grpId', 'unsignedInt') declare grpId?: number
  @defineAttribute('id', 'ST_TLTimeNodeID') declare id?: number
  @defineAttribute('masterRel', 'ST_TLTimeNodeMasterRelation') declare masterRel?: 'none' | 'sameClick' | 'lastClick' | 'nextClick'
  @defineAttribute('nodePh', 'boolean') declare nodePh?: boolean
  @defineAttribute('nodeType', 'ST_TLTimeNodeType') declare nodeType?: 'tm' | 'par' | 'seq' | 'excl' | 'anim' | 'clickEffect' | 'withEffect' | 'afterEffect' | 'repeat' | 'childDefault'
  @defineAttribute('presetClass', 'ST_TLTimeNodePresetClassType') declare presetClass?: 'entr' | 'exit' | 'emph' | 'path' | 'verb'
  @defineAttribute('presetID', 'int') declare presetID?: number
  @defineAttribute('presetSubtype', 'int') declare presetSubtype?: number
  // 'indefinite' | 'prev' | 0 | number
  @defineAttribute('repeatCount', 'ST_TLTime') declare repeatCount?: any
  // 'indefinite' | 'prev' | 0 | number
  @defineAttribute('repeatDur', 'ST_TLTime') declare repeatDur?: any
  @defineAttribute('restart', 'ST_TLTimeNodeRestartType') declare restart?: 'never' | 'whenNotActive' | 'always'
  @defineAttribute('spd', 'ST_Percentage') declare spd?: number
  @defineAttribute('syncBehavior', 'ST_TLTimeNodeSyncType') declare syncBehavior?: 'start' | 'end' | 'mid' | 'after' | 'before'
  @defineAttribute('tmFilter') declare tmFilter?: string

  @defineChild('p:childTnLst') declare childTnLst?: ChildTimeNodeList
  @defineChild('p:endCondLst') declare endCondLst?: OOXML
  @defineChild('p:endSync') declare endSync?: OOXML
  @defineChild('p:iterate') declare iterate?: OOXML
  @defineChild('p:stCondLst') declare stCondLst?: StartConditionList
  @defineChild('p:subTnLst') declare subTnLst?: OOXML
}
