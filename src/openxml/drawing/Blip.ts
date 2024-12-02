import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.blip
 */
@defineNode('blip', 'a')
export class Blip extends XmlObject {
  @defineProperty('r:embed', 'string') declare rEmbed: string
}
