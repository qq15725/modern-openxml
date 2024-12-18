import type { BodyProperties } from './BodyProperties'
import type { ExtensionList } from './ExtensionList'
import type { ListStyle } from './ListStyle'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { defineChild, OOXML } from '../../core'

export abstract class _Default extends OOXML {
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:bodyPr') declare bodyPr?: BodyProperties
  @defineChild('a:lstStyle') declare lstStyle?: ListStyle
  @defineChild('a:spPr') declare spPr?: ShapeProperties
  @defineChild('a:style') declare style?: ShapeStyle
}
