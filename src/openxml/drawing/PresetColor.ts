import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.presetcolor
 */
@defineElement('a:prstClr')
export class PresetColor extends OXML {
  @defineAttribute('val') declare val: string
}
