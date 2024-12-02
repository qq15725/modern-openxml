import { defineChild } from '../../core'
import { EffectList, GradientFill, NoFill, PatternFill, SolidFill } from '../drawing'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.backgroundproperties
 */
export class BackgroundProperties extends _Namespace {
  readonly tag = 'bgPr'

  @defineChild('a:blipFill', _Namespace) declare blipFill: _Namespace
  @defineChild('a:effectDag', _Namespace) declare effectDag: _Namespace
  @defineChild('a:effectLst', EffectList) declare effectLst: EffectList
  @defineChild('a:extLst', _Namespace) declare extLst: _Namespace
  @defineChild('a:gradFill', GradientFill) declare gradFill: GradientFill
  @defineChild('a:grpFill', _Namespace) declare grpFill: _Namespace
  @defineChild('a:noFill', NoFill) declare noFill: NoFill
  @defineChild('a:pattFill', PatternFill) declare pattFill: PatternFill
  @defineChild('a:solidFill', SolidFill) declare solidFill: SolidFill
}
