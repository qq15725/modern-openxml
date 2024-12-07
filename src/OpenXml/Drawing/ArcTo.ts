import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.arcto
 */
@defineElement('a:arcTo')
export class ArcTo extends OXML {
  @defineAttribute('hR') declare hR: string
  @defineAttribute('wR') declare wR: string
  @defineAttribute('stAng') declare stAng: string
  @defineAttribute('swAng') declare swAng: string
}
