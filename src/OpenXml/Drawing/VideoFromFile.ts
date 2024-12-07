import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.videofromfile
 */
@defineElement('a:videoFile')
export class VideoFromFile extends OXML {
  @defineAttribute('r:link') declare rLink: string
}
