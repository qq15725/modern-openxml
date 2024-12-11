import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.videofromfile
 */
@defineElement('a:videoFile')
export class VideoFromFile extends OOXML {
  @defineAttribute('r:link') declare rLink: string
}
