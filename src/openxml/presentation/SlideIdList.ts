import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { SlideId } from './SlideId'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slideidlist
 */
export class SlideIdList extends _Namespace {
  readonly tag = 'sldIdLst'

  @defineChild('p:sldId', SlideId, true) declare children: SlideId[]
}
