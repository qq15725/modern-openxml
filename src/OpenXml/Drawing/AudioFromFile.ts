import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.audiofromfile
 */
@defineElement('a:audioFile')
export class AudioFromFile extends OOXML {
  @defineAttribute('r:link') declare rLink: string
}
