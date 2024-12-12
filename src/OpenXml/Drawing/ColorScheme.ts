import type { Accent1Color } from './Accent1Color'
import type { Accent2Color } from './Accent2Color'
import type { Accent3Color } from './Accent3Color'
import type { Accent4Color } from './Accent4Color'
import type { Accent5Color } from './Accent5Color'
import type { Accent6Color } from './Accent6Color'
import type { Dark1Color } from './Dark1Color'
import type { Dark2Color } from './Dark2Color'
import type { FollowedHyperlinkColor } from './FollowedHyperlinkColor'
import type { Hyperlink } from './Hyperlink'
import type { Light1Color } from './Light1Color'
import type { Light2Color } from './Light2Color'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.colorscheme
 */
@defineElement('a:clrScheme')
export class ColorScheme extends OOXML {
  @defineAttribute('name') declare name?: string

  @defineChild('a:dk1') declare dk1?: Dark1Color
  @defineChild('a:lt1') declare lt1?: Light1Color
  @defineChild('a:dk2') declare dk2?: Dark2Color
  @defineChild('a:lt2') declare lt2?: Light2Color
  @defineChild('a:accent1') declare accent1?: Accent1Color
  @defineChild('a:accent2') declare accent2?: Accent2Color
  @defineChild('a:accent3') declare accent3?: Accent3Color
  @defineChild('a:accent4') declare accent4?: Accent4Color
  @defineChild('a:accent5') declare accent5?: Accent5Color
  @defineChild('a:accent6') declare accent6?: Accent6Color
  @defineChild('a:hlink') declare hlink?: Hyperlink
  @defineChild('a:folHlink') declare folHlink?: FollowedHyperlinkColor
}
