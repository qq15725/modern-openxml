import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.extension
 */
@defineElement('p:ext')
export class Extension extends OOXML {
  @defineAttribute('uri', 'string', '{DAA4B4D4-6D71-4841-9C94-3DE7FCFB9230}') declare uri: string

  // <p14:media xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" r:embed="${nvPr.media}"/>
  @defineChild('p14:media') declare p14Media: OOXML
}
