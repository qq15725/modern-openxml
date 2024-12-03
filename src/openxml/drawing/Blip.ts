import { defineElement, defineProperty, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.blip
 */
@defineElement('blip', 'a')
export class Blip extends OXML {
  @defineProperty('r:embed', 'string') declare rEmbed: string
}
