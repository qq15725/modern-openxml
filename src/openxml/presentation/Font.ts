import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.font
 */
@defineElement('p:font')
export class Font extends OXML {
  @defineAttribute('charset') charset?: string
  @defineAttribute('panose') panose?: string
  @defineAttribute('pitchFamily') pitchFamily?: string
  @defineAttribute('typeface') typeface?: string
}
