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
import { defineAttribute, defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.colorscheme
 */
@defineElement('a:clrScheme')
export class ColorScheme extends OXML {
  @defineAttribute('name') declare name?: string

  @defineChild('a:dk1') declare dk1?: Dark1Color
  @defineChild('a:lt1') declare lt1?: Light1Color
  @defineChild('a:dk2') declare dk2?: Dark2Color
  @defineChild('a:lt2') declare lt2?: Light2Color
  @defineChild('a:accent1', { isProperty: true }) declare accent1?: Accent1Color
  @defineChild('a:accent2', { isProperty: true }) declare accent2?: Accent2Color
  @defineChild('a:accent3', { isProperty: true }) declare accent3?: Accent3Color
  @defineChild('a:accent4', { isProperty: true }) declare accent4?: Accent4Color
  @defineChild('a:accent5', { isProperty: true }) declare accent5?: Accent5Color
  @defineChild('a:accent6', { isProperty: true }) declare accent6?: Accent6Color
  @defineChild('a:hlink') declare hlink?: Hyperlink
  @defineChild('a:folHlink') declare folHlink?: FollowedHyperlinkColor

  @defineProperty('dk1') declare dark1?: string
  @defineProperty('dk2') declare dark2?: string
  @defineProperty('lt1') declare light1?: string
  @defineProperty('lt2') declare light2?: string
  @defineProperty('hlink') declare hyperlink?: string
  @defineProperty('folHlink') declare followedHyperlink?: string
}
