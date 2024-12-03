import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.blip
 */
@defineElement('blip', 'a')
export class Blip extends OXML {
  @defineAttribute('r:embed') declare rEmbed: string
}
