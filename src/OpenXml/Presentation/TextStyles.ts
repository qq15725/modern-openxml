import type { BodyStyle } from './BodyStyle'
import type { ExtensionList } from './ExtensionList'
import type { OtherStyle } from './OtherStyle'
import type { TitleStyle } from './TitleStyle'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.textstyles
 */
@defineElement('p:txStyles')
export class TextStyles extends OOXML {
  @defineChild('p:bodyStyle') declare bodyStyle?: BodyStyle
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:otherStyle') declare otherStyle?: OtherStyle
  @defineChild('p:titleStyle') declare titleStyle?: TitleStyle
}
