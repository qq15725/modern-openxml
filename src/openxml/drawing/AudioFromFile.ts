import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.audiofromfile
 */
@defineElement('a:audioFile')
export class AudioFromFile extends OXML {
  @defineAttribute('r:link') declare rLink: string
}