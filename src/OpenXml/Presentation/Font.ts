import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.font
 */
@defineElement('p:font')
export class Font extends OXML {
  @defineAttribute('charset') declare charset?: string
  @defineAttribute('panose') declare panose?: string
  @defineAttribute('pitchFamily') declare pitchFamily?: string
  @defineAttribute('typeface') declare typeface?: string
}
