import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { SlideMasterId } from './SlideMasterId'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasteridlist
 */
export class SlideMasterIdList extends _Namespace {
  readonly tag = 'sldMasterIdLst'

  @defineChild('p:sldMasterId', SlideMasterId, true) declare children: SlideMasterId[]
}
