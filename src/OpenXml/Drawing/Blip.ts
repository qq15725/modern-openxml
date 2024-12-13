import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.blip
 */
@defineElement('a:blip')
export class Blip extends OOXML {
  @defineAttribute('r:embed') declare rEmbed?: string
}
