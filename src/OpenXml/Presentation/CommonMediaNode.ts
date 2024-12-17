import type { CommonTimeNode } from './CommonTimeNode'
import type { TargetElement } from './TargetElement'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.commonmedianode
 */
@defineElement('p:cMediaNode')
export class CommonMediaNode extends OOXML {
  @defineAttribute('mute', 'boolean') declare mute?: boolean
  @defineAttribute('numSld', 'unsignedInt') declare numSld?: number
  @defineAttribute('showWhenStopped', 'boolean') declare showWhenStopped?: boolean
  @defineAttribute('vol', 'ST_PositiveFixedPercentage') declare vol?: number

  @defineChild('p:cTn') declare cTn?: CommonTimeNode
  @defineChild('p:tgtEl') declare tgtEl?: TargetElement
}
